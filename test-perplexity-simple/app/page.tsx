'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface CountyData {
  name: string
  population: number
  state: string
}

export default function Home() {
  const [data, setData] = useState<CountyData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCountyData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/counties')
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const result = await response.json()
      setData(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Top Counties by Population
      </h1>
      
      <div className="text-center mb-8">
        <button
          onClick={fetchCountyData}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Loading...' : 'Get Top Counties'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {data.length > 0 && (
        <div className="space-y-8">
          {/* Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">County Data Table</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Rank</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">County</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">State</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Population</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((county, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{county.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{county.state}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {county.population.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Graph */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Population Chart</h2>
            <div className="bg-white p-4 border border-gray-300 rounded">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Population']}
                  />
                  <Bar dataKey="population" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

