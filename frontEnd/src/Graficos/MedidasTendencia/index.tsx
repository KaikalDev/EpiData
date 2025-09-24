import { useEffect, useState } from 'react'
import {
  GetDadosFaixaEtaria,
  GetDadosMeses,
  GetDadosPorMunicipio,
  GetTotalAno
} from '../../Data'
import { FormatNumber, mean, median, std } from './../../Utils/utils'
import { MedidasTendenciaContainer } from './styles'

const MedidasTendencias = () => {
  const [ano, setAno] = useState('2024')
  const [totalAno, setTotalAno] = useState(0)
  const [dadosMes, setDadosMes] = useState<TypeDado>([['Mes', 'Casos']])
  const [dadosMunicipio, setDadosMunicipio] = useState<TypeDado>([
    ['Municipio', 'Casos']
  ])
  const [dadosFaixaEtaria, setDadosFaixaEtaria] = useState<TypeDado>([
    ['Faixa Etaria', 'Casos']
  ])

  useEffect(() => {
    const fetchData = async () => {
      const fetchMes = await GetDadosMeses(ano as Ano)
      const fetchFaixaEtaria = await GetDadosFaixaEtaria(ano as Ano)
      const fetchMunicipio = await GetDadosPorMunicipio({
        ano: ano as Ano
      })
      const fetchTotalAno = await GetTotalAno(ano as Ano)
      setTotalAno(fetchTotalAno)
      setDadosMes(fetchMes)
      setDadosFaixaEtaria(fetchFaixaEtaria)
      setDadosMunicipio(fetchMunicipio)
    }
    fetchData()
  }, [ano])

  const calcStats = (dados: TypeDado) => {
    const valores = dados.slice(1).map((d) => Number(d[1]))
    return {
      media: FormatNumber(mean(valores)),
      mediana: FormatNumber(median(valores)),
      desvio: FormatNumber(std(valores))
    }
  }

  const statsMes = calcStats(dadosMes)
  const statsFaixa = calcStats(dadosFaixaEtaria)
  const statsMunicipio = calcStats(dadosMunicipio)

  return (
    <MedidasTendenciaContainer>
      <div className="header">
        <select value={ano} onChange={(e) => setAno(e.target.value)}>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>

        <p>
          Total de casos em {ano}:{' '}
          <b>{new Intl.NumberFormat('pt-BR', {}).format(totalAno)}</b>
        </p>
      </div>

      <div className="cardList">
        <div className="card">
          <h3>Casos por Mês</h3>
          <p>Média: {statsMes.media}</p>
          <p>Mediana: {statsMes.mediana}</p>
          <p>Desvio padrão: {statsMes.desvio}</p>
        </div>

        <div className="card">
          <h3>Casos por Faixa Etária</h3>
          <p>Média: {statsFaixa.media}</p>
          <p>Mediana: {statsFaixa.mediana}</p>
          <p>Desvio padrão: {statsFaixa.desvio}</p>
        </div>

        <div className="card">
          <h3>Casos por Município</h3>
          <p>Média: {statsMunicipio.media}</p>
          <p>Mediana: {statsMunicipio.mediana}</p>
          <p>Desvio padrão: {statsMunicipio.desvio}</p>
        </div>
      </div>
    </MedidasTendenciaContainer>
  )
}

export default MedidasTendencias
