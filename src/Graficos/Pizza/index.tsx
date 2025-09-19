import { useState } from 'react'
import Chart from 'react-google-charts'
import { FaixaEtaria, Genero, Meses } from '../../Data/Data'

const Pizza = () => {
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
          chartType="PieChart"
          width="100%"
          height="500px"
          data={Genero}
          options={{
            title: `Distribuição de casos por gênero - ${ano}`,
            pieHole: 0.3
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
          chartType="PieChart"
          width="100%"
          height="500px"
          data={Meses}
          options={{
            title: `Distribuição de casos por mês - ${ano}`,
            pieHole: 0.3
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
          chartType="PieChart"
          width="100%"
          height="500px"
          data={FaixaEtaria}
          options={{
            title: `Distribuição de casos por Faixa etária - ${ano}`,
            pieHole: 0.3
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

export default Pizza
