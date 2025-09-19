import React, { useState } from 'react'
import Papa from 'papaparse'

type CsvTableProps = {
  delimiter?: string // caso queira mudar o separador (default: ",")
}

const CsvTable: React.FC<CsvTableProps> = ({ delimiter = ',' }) => {
  const [data, setData] = useState<string[][]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      delimiter,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data as string[][])
      }
    })
  }

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {data.length > 0 && (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              {data[0].map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default CsvTable
