import { useEffect, useState } from 'react'
import { RiscoContainer } from './styles'
import { GetAllMunicipios } from '../../services'
import Chart from 'react-google-charts'

type Municipio = {
  municipio: string
  total: number
  previsoes_mensais: {
    Jan: number
    Feb: number
    Mar: number
    Apr: number
    May: number
    Jun: number
    Jul: number
    Aug: number
    Sep: number
    Oct: number
    Nov: number
    Dec: number
  }
}

const RiscoMunicipio = () => {
  const [municipio, setMunicipio] = useState<Municipio | undefined>()
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [nomes, setNomes] = useState<string[]>([])

  useEffect(() => {
    const fetchMunicipios = async () => {
      const municipios = await GetAllMunicipios()
      setMunicipios(municipios)
      setNomes(municipios.map((municipio) => municipio.municipio).sort())
      setMunicipio(municipios.find((m) => m.municipio === 'João Pessoa'))
    }

    fetchMunicipios()
  }, [])

  const dadosMes = municipio?.previsoes_mensais
    ? [
        ['Mês', 'Casos'],
        ...Object.entries(municipio.previsoes_mensais).map(([mes, valor]) => [
          mes,
          valor
        ])
      ]
    : [['Mês', 'Casos']]

  return (
    <RiscoContainer>
      <h2>Busque por municípios</h2>
      <select
        name=""
        id=""
        value={municipio?.municipio}
        onChange={(e) => {
          const selecionado = municipios.find(
            (m) => m.municipio === e.target.value
          )
          setMunicipio(selecionado)
        }}
      >
        {nomes.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      {municipio ? (
        <>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={dadosMes}
            options={{
              title: `Casos X Mês`,
              legend: { position: 'none' },
              colors: ['#4285F4'],
              hAxis: {
                title: 'Meses',
                slantedText: true,
                slantedTextAngle: 45
              },
              vAxis: { title: 'Número de casos' }
            }}
          />
        </>
      ) : (
        <p>Selecione um município para visualizar os gráficos.</p>
      )}
    </RiscoContainer>
  )
}

export default RiscoMunicipio
