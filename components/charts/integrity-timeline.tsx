"use client"

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { IntegrityHistoryPoint } from '@/lib/mock-data'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface IntegrityTimelineProps {
  data: IntegrityHistoryPoint[]
  title?: string
}

export function IntegrityTimeline({ data, title = "Histórico de Integridade" }: IntegrityTimelineProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const formattedData = data.map(point => ({
    ...point,
    dateFormatted: format(new Date(point.date), 'dd/MM', { locale: ptBR })
  }))

  const getStrokeColor = (value: number) => {
    if (value >= 70) return "#10b981"
    if (value >= 40) return "#f59e0b"
    return "#ef4444"
  }

  const averageIntegrity = Math.round(
    data.reduce((sum, point) => sum + point.integrity, 0) / data.length
  )

  const currentIntegrity = data[data.length - 1]?.integrity || 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isClient && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Média:</span>
              <span className={`font-semibold ${
                averageIntegrity >= 70 ? 'text-green-600' :
                averageIntegrity >= 40 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {averageIntegrity}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Atual:</span>
              <span className={`font-semibold ${
                currentIntegrity >= 70 ? 'text-green-600' :
                currentIntegrity >= 40 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {currentIntegrity}%
              </span>
            </div>
          </div>
        )}
      </div>

      {!isClient ? (
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="text-gray-500">Carregando gráfico...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="dateFormatted" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
              formatter={(value: number) => [`${value}%`, 'Integridade']}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={() => 'Integridade (%)'}
            />
            <Line 
              type="monotone" 
              dataKey="integrity" 
              stroke={getStrokeColor(averageIntegrity)}
              strokeWidth={2}
              dot={{ fill: getStrokeColor(averageIntegrity), r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

