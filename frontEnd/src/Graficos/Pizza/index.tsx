import { useEffect, useState } from 'react'
import Chart from 'react-google-charts'
import { GetDadosFaixaEtaria, GetDadosGenero, GetDadosMeses } from '../../Data'

type TypeDado = [string, number | string][]

const Pizza = () => {
  const [ano, setAno] = useState('2024')
  const [dadosGenero, setDadosGenero] = useState<TypeDado>([
    ['Genero', 'Casos']
  ])
  const [dadosMes, setDadosMes] = useState<TypeDado>([['Mes', 'Casos']])
  const [dadosFaixaEtaria, setDadosFaixaEtaria] = useState<TypeDado>([
    ['Faixa Etaria', 'Casos']
  ])

  useEffect(() => {
    const fetchData = async () => {
      const fetchGenero = await GetDadosGenero(ano as Ano)
      const fetchMes = await GetDadosMeses(ano as Ano)
      const fetchFaixaEtaria = await GetDadosFaixaEtaria(ano as Ano)
      setDadosGenero(fetchGenero)
      setDadosMes(fetchMes)
      setDadosFaixaEtaria(fetchFaixaEtaria)
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
          chartType="PieChart"
          width="100%"
          height="500px"
          data={dadosGenero}
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
          data={dadosMes}
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
          data={dadosFaixaEtaria}
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
