"use client"

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Block } from '@/lib/mock-data'

interface StatusDistributionProps {
  blocks: Block[]
  title?: string
}

const COLORS = {
  bom: '#10b981',
  alerta: '#f59e0b',
  critico: '#ef4444'
}

export function StatusDistribution({ blocks, title = "Distribuição por Status" }: StatusDistributionProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  const statusCounts = blocks.reduce((acc, block) => {
    if (block.integrity >= 70) {
      acc.bom += 1
    } else if (block.integrity >= 40) {
      acc.alerta += 1
    } else {
      acc.critico += 1
    }
    return acc
  }, { bom: 0, alerta: 0, critico: 0 })

  const data = [
    { name: 'Bom (≥70%)', value: statusCounts.bom, color: COLORS.bom },
    { name: 'Alerta (40-69%)', value: statusCounts.alerta, color: COLORS.alerta },
    { name: 'Crítico (<40%)', value: statusCounts.critico, color: COLORS.critico },
  ]

  const total = blocks.length

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {!isClient ? (
        <div className="w-full h-[200px] flex items-center justify-center">
          <div className="text-gray-500">Carregando gráfico...</div>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value: number) => [`${value} blocos`, '']}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex-1 space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({((item.value / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total de Blocos</span>
              <span className="text-sm font-semibold text-gray-900">{total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

