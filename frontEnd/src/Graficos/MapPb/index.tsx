import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { normalize } from '../../Utils/utils'

type Props = {
  geoJsonData: object
  dataPorMunicipio: { municipio: string; casos: number }[]
}

const MapPB = ({ geoJsonData, dataPorMunicipio }: Props) => {
  const [tooltipContent, setTooltipContent] = useState<string>('')
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const casosPorNome = (nome: string) => {
    const entry = dataPorMunicipio.find(
      (d) => normalize(d.municipio) === normalize(nome)
    )
    return entry ? entry.casos : 0
  }

  const minCasos = Math.min(...dataPorMunicipio.map((d) => d.casos))
  const maxCasos = Math.max(...dataPorMunicipio.map((d) => d.casos))

  const colorScale = (casos: number) => {
    const intensity =
      (Math.log(casos + 1) - Math.log(minCasos + 1)) /
      (Math.log(maxCasos + 1) - Math.log(minCasos + 1) || 1)

    const start = [224, 242, 255]
    const end = [66, 133, 244]

    const r = Math.round(start[0] + intensity * (end[0] - start[0]))
    const g = Math.round(start[1] + intensity * (end[1] - start[1]))
    const b = Math.round(start[2] + intensity * (end[2] - start[2]))

    return `rgb(${r},${g},${b})`
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '550px' }}>
      {tooltipContent && (
        <div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            top: tooltipPos.y + 10,
            left: tooltipPos.x + 10,
            background: 'white',
            padding: '4px 8px',
            border: '1px solid #aaa',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 10
          }}
        >
          {tooltipContent}
        </div>
      )}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [-36.9, -8.2],
          scale: 10000
        }}
        width={800}
        height={800}
      >
        <Geographies geography={geoJsonData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const nomeMunicipio =
                geo.properties.nome ??
                geo.properties.Nome ??
                geo.properties.name
              const casos = casosPorNome(nomeMunicipio)
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(casos)}
                  stroke="#aaa"
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#f0a', outline: 'none' },
                    pressed: { outline: 'none' }
                  }}
                  onMouseEnter={(e) => {
                    setTooltipContent(`${nomeMunicipio}: ${casos} casos`)
                    setTooltipPos({ x: e.clientX, y: e.clientY })
                  }}
                  onMouseMove={(e) => {
                    setTooltipPos({ x: e.clientX, y: e.clientY })
                  }}
                  onMouseLeave={() => setTooltipContent('')}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}

export default MapPB
