import { useEffect, useState } from 'react'
import {
  GetAnaliseMesDados,
  GetAnalisePorMunicipioObj,
  GetAnaliseSurtos
} from '../../Data'
import MapPB from '../MapPb'
import geoJsonData from '../../Data/geojs-25-mun.json'
import Chart from 'react-google-charts'
import { MunicipioRisco } from '../../Data/api'
import { SurtosContainer } from '../../styles'

const Home = () => {
  const [dadosMunicipio, setDadosMunicipio] = useState<
    { municipio: string; casos: number }[]
  >([])
  const [dadosMes, setDadosMes] = useState<TypeDado>([['Mes', 'Casos']])
  const [dadosSurtos, setDadosSurtos] = useState<MunicipioRisco[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const [fetchMunicipio, fetchMes, fetchSurtos] = await Promise.all([
        GetAnalisePorMunicipioObj(),
        GetAnaliseMesDados(),
        GetAnaliseSurtos()
      ])

      setDadosMunicipio(fetchMunicipio)
      setDadosMes(fetchMes)
      setDadosSurtos(fetchSurtos)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  if (!isLoading) {
    return (
      <>
        <div>
          <MapPB dataPorMunicipio={dadosMunicipio} geoJsonData={geoJsonData} />
        </div>
        <div>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="500px"
            data={dadosMes}
            options={{
              title: `Analise preditiva de 2026 - Total: ${
                dadosMes.length > 1
                  ? dadosMes
                      .slice(1)
                      .reduce(
                        (acc, [, casos]) => acc + parseInt(String(casos)) || 0,
                        0
                      )
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
        {dadosSurtos.length > 0 && (
          <SurtosContainer className="surtos-container">
            <h3 className="surtos-title">
              Municípios com Maior Risco de Surto
            </h3>

            <div className="surtos-legenda">
              <span className="legenda-item risco-alto">Alto (≥ 70)</span>
              <span className="legenda-item risco-moderado">
                Moderado (40 - 69)
              </span>
              <span className="legenda-item risco-baixo">Baixo (&lt; 40)</span>
            </div>

            <ul className="surtos-list">
              {dadosSurtos.slice(0, 10).map((m, i) => (
                <li key={m.municipio} className="surtos-item">
                  <div className="surtos-info">
                    <span className="surtos-rank">#{i + 1}</span>
                    <span className="surtos-nome">{m.municipio}</span>
                  </div>

                  <div className="surtos-status">
                    <span
                      className={`surtos-classificacao ${
                        m.classificacao === 'Alto'
                          ? 'risco-alto'
                          : m.classificacao === 'Moderado'
                          ? 'risco-moderado'
                          : 'risco-baixo'
                      }`}
                    >
                      {m.classificacao}
                    </span>
                    <span className="surtos-pontuacao">
                      Índice: <b>{m.risco.toFixed(1)}</b>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </SurtosContainer>
        )}
      </>
    )
  } else {
    return <div>Carregando...</div>
  }
}

export default Home
