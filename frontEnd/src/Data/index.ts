import {
  GetDadosByCriterio,
  GetDadosAno,
  GetDadosIBGE,
  GetAnalise
} from './api'

type LinhaDado = [string, number | string]
type DadosMeses = [string, string] | LinhaDado

export const GetDadosGenero = async (ano: Ano): Promise<LinhaDado[]> => {
  const dados = await GetDadosByCriterio({ ano, criterio: 'porGenero' })

  if (!dados) return [['Genero', 'Casos']]

  const total = dados['Total'] ?? { Masculino: 0, Feminino: 0 }

  return [
    ['Genero', 'Casos'],
    ['Masculino', total.Masculino],
    ['Feminino', total.Feminino]
  ]
}

export const GetDadosMeses = async (ano: Ano): Promise<DadosMeses[]> => {
  const dados = await GetDadosByCriterio({ ano, criterio: 'porMes' })

  if (!dados) return [['Mes', 'Casos']]

  const total = dados['Total'] ?? {}

  const meses = Object.keys(total).filter((m) => m !== 'Total')

  return [
    ['Mes', 'Casos'],
    ...meses.map((mes) => [mes, total[mes] as number] as LinhaDado)
  ]
}

export const GetDadosFaixaEtaria = async (ano: Ano): Promise<LinhaDado[]> => {
  const dados = await GetDadosByCriterio({ ano, criterio: 'porFaixaEtaria' })

  if (!dados) {
    return [['Faixa Etária', 'Casos']]
  }

  const total = dados['Total'] ?? {}

  const faixas: string[] = [
    '<1 Ano',
    '1-4',
    '5-9',
    '10-14',
    '15-19',
    '20-39',
    '40-59',
    '60-64',
    '65-69',
    '70-79',
    '80 e +'
  ]

  return [
    ['Faixa Etária', 'Casos'],
    ...faixas.map((faixa) => [faixa, total[faixa] ?? 0] as LinhaDado)
  ]
}

export const GetDadosAnos = async (): Promise<LinhaDado[]> => {
  const resultados: LinhaDado[] = [['Ano', 'Casos']]

  const anos: Ano[] = ['2020', '2021', '2022', '2023', '2024']

  for (const ano of anos) {
    const dados = await GetDadosAno(ano)
    if (dados == null) continue

    const valor = Number(dados)
    resultados.push([ano.toString(), valor])
  }

  return resultados
}

export const GetTotalAno = async (ano: Ano) => {
  const dados = await GetDadosAno(ano)

  const valor = Number(dados)

  return valor
}

export const GetDadosPorMunicipio = async ({
  ano,
  quantidade
}: {
  ano: Ano
  quantidade?: number
}): Promise<LinhaDado[]> => {
  const dados = await GetDadosByCriterio({ ano, criterio: 'porMes' })
  if (!dados) return [['Município', 'Casos']]

  const municipios = Object.keys(dados)
    .filter((municipio) => municipio.toLowerCase() !== 'total')
    .map((municipio) => {
      const total = Number(dados[municipio]['Total'] ?? 0)
      return [municipio, total] as LinhaDado
    })

  municipios.sort((a, b) => Number(b[1]) - Number(a[1]))

  const selecionados = quantidade ? municipios.slice(0, quantidade) : municipios

  return [['Município', 'Casos'], ...selecionados]
}

export const GetDadosPorMunicipioObj = async (
  ano: Ano
): Promise<{ municipio: string; casos: number }[]> => {
  const dados = await GetDadosByCriterio({ ano, criterio: 'porMes' })
  if (!dados) return []

  const municipios = Object.keys(dados)
    .filter((municipio) => municipio.toLowerCase() !== 'total')
    .map((municipio) => {
      const total = Number(dados[municipio]['Total'] ?? 0)
      return { municipio, casos: total }
    })

  municipios.sort((a, b) => b.casos - a.casos)

  return municipios
}

export const GetDispercaoPopulacaoCaso = async (
  ano: Ano
): Promise<(string | number)[][]> => {
  const dados = await GetDadosIBGE(ano)
  if (!dados) return [['População', 'Casos']]

  const dispersao = Object.keys(dados)
    .filter((municipio) => municipio.toLowerCase() !== 'total')
    .map((municipio) => {
      const populacao = Number(dados[municipio]['População'] ?? 0)
      const casos = Number(dados[municipio]['Total'] ?? 0)
      return [populacao, casos]
    })

  return [['População', 'Casos'], ...dispersao]
}

export const GetDispercaoIDHMCaso = async (
  ano: Ano
): Promise<(string | number)[][]> => {
  const dados = await GetDadosIBGE(ano)
  if (!dados) return [['IDHM', 'Casos']]

  const dispersao = Object.keys(dados)
    .filter((municipio) => municipio.toLowerCase() !== 'total')
    .map((municipio) => {
      const idhm = Number(dados[municipio]['IDHM'] ?? 0)
      const casos = Number(dados[municipio]['Total'] ?? 0)
      return [idhm, casos]
    })

  return [['IDHM', 'Casos'], ...dispersao]
}

export const GetDispercaoPIBCaso = async (
  ano: Ano
): Promise<(string | number)[][]> => {
  const dados = await GetDadosIBGE(ano)
  if (!dados) return [['PIB', 'Casos']]

  const dispersao = Object.keys(dados)
    .filter((municipio) => municipio.toLowerCase() !== 'total')
    .map((municipio) => {
      const pib = Number(dados[municipio]['PIB'] ?? 0)
      const casos = Number(dados[municipio]['Total'] ?? 0)
      return [pib, casos]
    })

  return [['PIB', 'Casos'], ...dispersao]
}

export const GetAnaliseDados = async (): Promise<LinhaDado[]> => {
  const dados = await GetAnalise()

  if (!dados || !dados.previsoes || !dados.previsoes['2026'])
    return [['Mês', 'Casos']]

  const meses2026 = dados.previsoes['2026']

  const linhas: LinhaDado[] = Object.entries(meses2026).map(([mes, casos]) => [
    mes,
    casos as number
  ])

  return [['Mês', 'Casos'], ...linhas]
}
