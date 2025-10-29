const baseUrl = 'http://127.0.0.1:5000'

export type MunicipioRisco = {
  municipio: string
  risco: number
  classificacao: 'Baixo' | 'Moderado' | 'Alto'
  crescimento: number
  casosPorHabitante: number
  idhm: number
  populacao: number
  casos_previstos: number
  indice: number
}

export const GetDadosByCriterio = async ({
  ano,
  criterio
}: {
  ano: Ano
  criterio: 'porMes' | 'porFaixaEtaria' | 'porGenero'
}) => {
  try {
    const response = await fetch(`${baseUrl}/dados/anos/${ano}/${criterio}`)
    if (!response.ok) throw new Error('Erro ao buscar dados')

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro no pegar os dados:', error)
    return null
  }
}

export const GetDadosAno = async (ano: Ano) => {
  try {
    const response = await fetch(`${baseUrl}/dados/total?ano=${ano}`)
    if (!response.ok) throw new Error('Erro ao buscar dados')

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro no pegar os dados:', error)
    return null
  }
}

export const GetDadosIBGE = async (ano: Ano) => {
  try {
    const response = await fetch(`${baseUrl}/dados/ibge/${ano}`)
    if (!response.ok) throw new Error('Erro ao buscar dados')

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro no pegar os dados:', error)
    return null
  }
}

export const GetAnaliseMes = async () => {
  try {
    const response = await fetch('Data/total_mes.json')
    if (!response.ok) throw new Error('Erro ao carregar JSON')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao pegar os dados locais:', error)
    return null
  }
}

export const GetAnaliseMunicipio = async () => {
  try {
    const response = await fetch('Data/total_municipio.json')
    if (!response.ok) throw new Error('Erro ao carregar JSON')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao pegar os dados locais:', error)
    return null
  }
}

export const GetIBGEFixo = async () => {
  try {
    const response = await fetch('Data/IBGE.json')
    if (!response.ok) throw new Error('Erro ao carregar JSON')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao pegar os dados locais:', error)
    return null
  }
}
