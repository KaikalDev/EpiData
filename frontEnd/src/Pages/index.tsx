import { useState } from 'react'
import MedidasTendencias from '../Graficos/MedidasTendencia'
import Pizza from '../Graficos/Pizza'
import { NavegadorContainer } from './styles'
import Barra from '../Graficos/Barra'
import Histograma from '../Graficos/Histograma'

const paginas = [
  {
    title: 'Home',
    page: <></>
  },
  {
    title: 'Histogramas',
    page: <Histograma />
  },
  {
    title: 'Medidas de Tendência Central e Dispersão',
    page: <MedidasTendencias />
  },
  // {
  //   title: 'Gráficos de Dispersão',
  //   page: <Dispersao />
  // },
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
      {active?.page}
    </section>
  )
}

export default Page
