"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Obra } from "@/lib/mock-data"

interface ObrasStatusDistributionProps {
  obras: Obra[]
  title?: string
}

const COLORS = {
  active: "#10b981", // verde
  warning: "#f59e0b", // amarelo
  critical: "#ef4444", // vermelho
}

const STATUS_LABELS = {
  active: "Ativas",
  warning: "Atenção",
  critical: "Críticas",
}

export function ObrasStatusDistribution({
  obras,
  title = "Distribuição de Status das Obras",
}: ObrasStatusDistributionProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Agrupar obras por status
  const statusData = [
    {
      name: STATUS_LABELS.active,
      value: obras.filter((o) => o.status === "active").length,
      status: "active",
    },
    {
      name: STATUS_LABELS.warning,
      value: obras.filter((o) => o.status === "warning").length,
      status: "warning",
    },
    {
      name: STATUS_LABELS.critical,
      value: obras.filter((o) => o.status === "critical").length,
      status: "critical",
    },
  ].filter((item) => item.value > 0) // Remove categorias com 0 obras

  const totalObras = obras.length

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
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
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.status as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                formatter={(value: number) => [
                  `${value} obra${value !== 1 ? "s" : ""}`,
                  "Total",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legenda customizada */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {statusData.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor: COLORS[item.status as keyof typeof COLORS],
                  }}
                />
                <span className="text-sm text-gray-600">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Total de {totalObras} obra{totalObras !== 1 ? "s" : ""} monitorada
              {totalObras !== 1 ? "s" : ""}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

