"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { Obra } from '@/lib/mock-data'

interface ObrasComparisonProps {
  obras: Obra[]
  title?: string
}

export function ObrasComparison({ obras, title = "Níveis de Integridade por Obra" }: ObrasComparisonProps) {
  const data = obras.map(obra => ({
    name: obra.name.length > 25 ? obra.name.substring(0, 25) + '...' : obra.name,
    fullName: obra.name,
    integrity: obra.integrity,
    location: obra.location
  }))

  const getColor = (value: number) => {
    if (value >= 70) return "#10b981"
    if (value >= 40) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            label={{ value: 'Integridade (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b7280', textAnchor: 'middle' } }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            formatter={(value: number) => [`${value}%`, 'Integridade']}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullName
              }
              return label
            }}
          />
          <Bar dataKey="integrity" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.integrity)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10b981" }} />
          <span className="text-gray-600">Bom (≥70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "#f59e0b" }} />
          <span className="text-gray-600">Alerta (40-69%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "#ef4444" }} />
          <span className="text-gray-600">Crítico (&lt;40%)</span>
        </div>
      </div>
    </div>
  )
}

