import { useState } from 'react'
import Chart from 'react-google-charts'
import { IDH, Populacao } from '../../Data/Data'

const Dispersao = () => {
  const [ano, setAno] = useState('2024')

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
          data={Populacao}
          options={{
            title: `Casos X População - ${ano}`,
            hAxis: { title: 'População' },
            vAxis: { title: 'Casos' },
            legend: 'none',
            pointSize: 6,
            colors: ['#DB4437']
          }}
        />
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem
          repellendus fuga, libero reiciendis, laborum deserunt minima quas
          voluptas earum iusto eum! Magni id earum assumenda, incidunt officia
          laborum vitae adipisci.
        </p>
      </div>
      <div>
        <Chart
          chartType="ScatterChart"
          width="100%"
          height="500px"
          data={IDH}
          options={{
            title: `Casos X IDH - ${ano}`,
            hAxis: { title: 'IDH' },
            vAxis: { title: 'Casos' },
            legend: 'none',
            pointSize: 6,
            colors: ['#DB4437']
          }}
        />
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem
          repellendus fuga, libero reiciendis, laborum deserunt minima quas
          voluptas earum iusto eum! Magni id earum assumenda, incidunt officia
          laborum vitae adipisci.
        </p>
      </div>
    </>
  )
}

export default Dispersao
