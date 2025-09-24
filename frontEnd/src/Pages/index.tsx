import { useState } from 'react'
import MedidasTendencias from '../Graficos/MedidasTendencia'
import Pizza from '../Graficos/Pizza'
import { GraficosContainer, NavegadorContainer } from './styles'
import Barra from '../Graficos/Barra'
import Histograma from '../Graficos/Histograma'
import Home from '../Graficos/Home'
import Dispersao from '../Graficos/Dispersao'

const paginas = [
  {
    title: 'Home',
    page: <Home />
  },
  {
    title: 'Histogramas',
    page: <Histograma />
  },
  {
    title: 'Medidas de Tendência Central e Dispersão',
    page: <MedidasTendencias />
  },
  {
    title: 'Gráficos de Dispersão',
    page: <Dispersao />
  },
  {
    title: 'Gráficos de Pizza',
    page: <Pizza />
  },
  {
    title: 'Gráficos de Barra',
    page: <Barra />
  }
]

const Page = () => {
  const [active, setActive] = useState(paginas.find((p) => p.title === 'Home'))
  return (
    <section className="Container">
      <NavegadorContainer>
        <ul>
          {paginas.map((p, i) => (
            <li
              className={p == active ? '--active' : ''}
              onClick={() => setActive(p)}
              key={i}
            >
              {p.title}
            </li>
          ))}
        </ul>
      </NavegadorContainer>
      <GraficosContainer>
        <h2 className="Title">{active?.title}</h2>
        {active?.page}
      </GraficosContainer>
    </section>
  )
}

export default Page
