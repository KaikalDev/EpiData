import { useState } from 'react'
import Chart from 'react-google-charts'

const Histogramas = () => {
  const [ano, setAno] = useState('2024')
  // return (
  //   <>
  //     <select
  //       value={ano}
  //       onChange={(e) => setAno(e.target.value)}
  //       name=""
  //       id=""
  //     >
  //       <option value="2024">2024</option>
  //       <option value="2023">2023</option>
  //       <option value="2022">2022</option>
  //       <option value="2021">2021</option>
  //       <option value="2020">2020</option>
  //     </select>
  //     <div>
  //       <Chart
  //         chartType="Histogram"
  //         width="100%"
  //         height="500px"
  //         data={Municipio}
  //         options={{
  //           title: `Casos x Municípios - ${ano}`,
  //           legend: { position: 'none' },
  //           hAxis: { title: 'Casos' },
  //           vAxis: { title: 'Municípios' }
  //         }}
  //       />
  //       <p>
  //         Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem
  //         repellendus fuga, libero reiciendis, laborum deserunt minima quas
  //         voluptas earum iusto eum! Magni id earum assumenda, incidunt officia
  //         laborum vitae adipisci.
  //       </p>
  //     </div>
  //     <div>
  //       <Chart
  //         chartType="Histogram"
  //         width="100%"
  //         height="500px"
  //         data={Meses}
  //         options={{
  //           title: `Casos x Meses - ${ano}`,
  //           legend: { position: 'none' },
  //           hAxis: { title: 'Casos' },
  //           vAxis: { title: 'Meses' }
  //         }}
  //       />
  //       <p>
  //         Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem
  //         repellendus fuga, libero reiciendis, laborum deserunt minima quas
  //         voluptas earum iusto eum! Magni id earum assumenda, incidunt officia
  //         laborum vitae adipisci.
  //       </p>
  //     </div>
  //     <div>
  //       <Chart
  //         chartType="Histogram"
  //         width="100%"
  //         height="500px"
  //         data={Ano}
  //         options={{
  //           title: `Casos x Ano`,
  //           legend: { position: 'none' },
  //           hAxis: { title: 'Casos' },
  //           vAxis: { title: 'Ano' }
  //         }}
  //       />
  //       <p>
  //         Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem
  //         repellendus fuga, libero reiciendis, laborum deserunt minima quas
  //         voluptas earum iusto eum! Magni id earum assumenda, incidunt officia
  //         laborum vitae adipisci.
  //       </p>
  //     </div>
  //     <div>
  //       <Chart
  //         chartType="Histogram"
  //         width="100%"
  //         height="500px"
  //         data={FaixaEtaria}
  //         options={{
  //           title: `Casos x Faixa etária - ${ano}`,
  //           legend: { position: 'none' },
  //           hAxis: { title: 'Casos' },
  //           vAxis: { title: 'Faixa etária' }
  //         }}
  //       />
  //       <p>
  //         Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem
  //         repellendus fuga, libero reiciendis, laborum deserunt minima quas
  //         voluptas earum iusto eum! Magni id earum assumenda, incidunt officia
  //         laborum vitae adipisci.
  //       </p>
  //     </div>
  //   </>
  // )
}

export default Histogramas
