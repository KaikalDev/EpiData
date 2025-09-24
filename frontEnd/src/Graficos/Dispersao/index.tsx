import { useEffect, useState } from 'react'
import Chart from 'react-google-charts'
import {
  GetDispercaoIDHMCaso,
  GetDispercaoPIBCaso,
  GetDispercaoPopulacaoCaso
} from '../../Data'

const Dispersao = () => {
  const [ano, setAno] = useState('2024')
  const [dadosPopulacao, setDadosPopulacao] = useState<TypeDado>([
    ['População', 'Casos']
  ])
  const [dadosIDHM, setDadosIDHM] = useState<TypeDado>([['IDHM', 'Casos']])
  const [dadosPIB, setDadosPIB] = useState<TypeDado>([['PIB', 'Casos']])

  useEffect(() => {
    const fetchData = async () => {
      const fetchPopulacao = await GetDispercaoPopulacaoCaso(ano as Ano)
      const fetchIDHM = await GetDispercaoIDHMCaso(ano as Ano)
      const fetchPIB = await GetDispercaoPIBCaso(ano as Ano)

      setDadosPopulacao(fetchPopulacao)
      setDadosIDHM(fetchIDHM)
      setDadosPIB(fetchPIB)
    }

    fetchData()
  }, [ano])
  return (
    <>
      <select
        value={ano}
        onChange={(e) => setAno(e.target.value)}
        name=""
        id=""
      >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </select>
      <div>
        <Chart
          chartType="ScatterChart"
          width="100%"
          height="500px"
          data={dadosPopulacao}
          options={{
            title: `Casos X População - ${ano}`,
            hAxis: { title: 'População', logScale: true, maxValue: 900000 },
            vAxis: { title: 'Casos', logScale: true },
            legend: 'none',
            pointSize: 6,
            colors: ['#DB4437']
          }}
        />
      </div>
      <div>
        <Chart
          chartType="ScatterChart"
          width="100%"
          height="500px"
          data={dadosIDHM}
          options={{
            title: `Casos X IDH - ${ano}`,
            hAxis: { title: 'IDH', logScale: true },
            vAxis: { title: 'Casos', logScale: true },
            legend: 'none',
            pointSize: 6,
            colors: ['#DB4437']
          }}
        />
      </div>
      <div>
        <Chart
          chartType="ScatterChart"
          width="100%"
          height="500px"
          data={dadosPIB}
          options={{
            title: `Casos X PIB - ${ano}`,
            hAxis: { title: 'PIB', logScale: true },
            vAxis: { title: 'Casos', logScale: true },
            legend: 'none',
            pointSize: 6,
            colors: ['#DB4437']
          }}
        />
        <p>
          <b>Análise Diagnóstica:</b> Entre 2020 e 2024, os municípios da
          Paraíba apresentaram diferenças significativas no PIB, o que impactou
          de forma desigual o enfrentamento ao Zika vírus.
          <br />
          <br />
          <b>Análise Descritiva:</b> A baixa disponibilidade de verbas em
          cidades com PIB reduzido é um fator determinante para a persistência e
          disseminação do Zika vírus. A ausência de investimentos adequados em
          infraestrutura urbana e saúde pública aumenta a proliferação do Aedes
          aegypti, gerando maior risco de epidemias locais. Portanto, o PIB
          municipal funciona como indicador da vulnerabilidade: quanto menor a
          base econômica, maior a probabilidade de incidência do Zika por falhas
          estruturais de prevenção.
        </p>
      </div>
    </>
  )
}

export default Dispersao
