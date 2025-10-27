import { useEffect, useState } from 'react'
import { GetAnaliseDados, GetDadosPorMunicipioObj } from '../../Data'
import MapPB from '../MapPb'
import geoJsonData from '../../Data/geojs-25-mun.json'
import Chart from 'react-google-charts'

const Home = () => {
  const [ano, setAno] = useState('2024')
  const [dadosMunicipio, setDadosMunicipio] = useState<
    { municipio: string; casos: number }[]
  >([])
  const [dadosAno, setDadosAno] = useState<any[]>([['Ano', 'Casos']])
  const [anosDisponiveis, setAnosDisponiveis] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchMunicipio = await GetDadosPorMunicipioObj(ano as Ano)
      setDadosMunicipio(fetchMunicipio)

      const dados = await GetAnaliseDados()

      setDadosAno(dados)
      setAnosDisponiveis(dados.slice(1).map(([a]) => a))
    }

    fetchData()
  }, [ano])

  return (
    <>
      <select value={ano} onChange={(e) => setAno(e.target.value)}>
        {anosDisponiveis.length > 0 ? (
          anosDisponiveis.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))
        ) : (
          <>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </>
        )}
      </select>

      <div>
        <MapPB dataPorMunicipio={dadosMunicipio} geoJsonData={geoJsonData} />
        <p>Mapa dos casos na Paraíba ({ano}).</p>
        <p>
          <b>Análise Diagnóstica:</b> O epicentro geográfico da doença mudou ao
          longo dos anos, passando de Queimadas (2021-2022) para Alagoa Grande
          (2023) e, em 2024, para Campina Grande, que se tornou o principal foco
          do surto.
          <br />
          <br />
          <b>Análise Descritiva:</b> A mudança de epicentro aponta para a
          importância do controle local do vetor, que depende do engajamento da
          população na eliminação de criadouros, mesmo em cidades com bom
          saneamento básico.
        </p>
      </div>

      <div>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="500px"
          data={dadosAno}
          options={{
            title: `Analise preditiva de 2026 - Total: ${
              dadosAno.length > 1
                ? dadosAno.slice(1).reduce((acc, [, casos]) => acc + casos, 0)
                : 0
            } Casos`,
            legend: { position: 'none' },
            colors: ['#4285F4'],
            hAxis: {
              title: 'Meses',
              slantedText: true,
              slantedTextAngle: 45
            },
            vAxis: { title: 'Casos' }
          }}
        />
      </div>
    </>
  )
}

export default Home
