"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Obra } from "@/lib/mock-data"

interface ObrasByTypeProps {
  obras: Obra[]
  title?: string
}

export function ObrasByType({
  obras,
  title = "Integridade Média por Tipo de Obra",
}: ObrasByTypeProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Agrupar obras por tipo e calcular média de integridade
  const typeData = () => {
    const typeMap = new Map<string, { total: number; count: number }>()

    obras.forEach((obra) => {
      const type = obra.type || "Não especificado"
      if (!typeMap.has(type)) {
        typeMap.set(type, { total: 0, count: 0 })
      }
      const current = typeMap.get(type)!
      current.total += obra.integrity
      current.count += 1
    })

    return Array.from(typeMap.entries())
      .map(([type, data]) => ({
        type,
        integrity: Math.round(data.total / data.count),
        count: data.count,
      }))
      .sort((a, b) => b.integrity - a.integrity)
  }

  const data = typeData()

  const getColor = (value: number) => {
    if (value >= 70) return "#10b981" // verde
    if (value >= 40) return "#f59e0b" // amarelo
    return "#ef4444" // vermelho
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {!isClient ? (
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="text-gray-500">Carregando gráfico...</div>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                label={{
                  value: "Integridade Média (%)",
                  position: "insideBottom",
                  offset: -5,
                  style: { fontSize: "12px", fill: "#6b7280" },
                }}
              />
              <YAxis
                dataKey="type"
                type="category"
                width={150}
                stroke="#6b7280"
                style={{ fontSize: "11px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value}%`,
                  `Integridade (${props.payload.count} obra${
                    props.payload.count !== 1 ? "s" : ""
                  })`,
                ]}
                labelFormatter={(label) => `Tipo: ${label}`}
              />
              <Bar dataKey="integrity" radius={[0, 8, 8, 0]}>
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

          {/* Insights */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">Melhor Tipo</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {data.length > 0 ? data[0].type : "-"}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  {data.length > 0 ? `${data[0].integrity}%` : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tipos Monitorados</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {data.length}
                </p>
                <p className="text-xs text-gray-600">
                  {obras.length} obra{obras.length !== 1 ? "s" : ""} no total
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

