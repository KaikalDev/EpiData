import { useState } from 'react'
import { Chart } from 'react-google-charts'
import { Ano, FaixaEtaria, Meses, Municipio } from '../../Data/Data'

const Barra = () => {
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
          chartType="ColumnChart"
          width="100%"
          height="500px"
          data={Municipio}
          options={{
            title: `Casos X Município - ${ano}`,
            legend: { position: 'none' },
            colors: ['#4285F4'],
            hAxis: {
              title: 'Municípios',
              slantedText: true,
              slantedTextAngle: 45
            },
            vAxis: { title: 'Casos' }
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
          chartType="ColumnChart"
          width="100%"
          height="500px"
          data={Meses}
          options={{
            title: `Casos X Meses - ${ano}`,
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
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem
          repellendus fuga, libero reiciendis, laborum deserunt minima quas
          voluptas earum iusto eum! Magni id earum assumenda, incidunt officia
          laborum vitae adipisci.
        </p>
      </div>
      <div>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="500px"
          data={Ano}
          options={{
            title: `Casos X Ano - ${ano}`,
            legend: { position: 'none' },
            colors: ['#4285F4'],
            hAxis: {
              title: 'Ano',
              slantedText: true,
              slantedTextAngle: 45
            },
            vAxis: { title: 'Casos' }
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
          chartType="ColumnChart"
          width="100%"
          height="500px"
          data={FaixaEtaria}
          options={{
            title: `Casos X Faixa etária - ${ano}`,
            legend: { position: 'none' },
            colors: ['#4285F4'],
            hAxis: {
              title: 'Faixa etária',
              slantedText: true,
              slantedTextAngle: 45
            },
            vAxis: { title: 'Casos' }
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

export default Barra
