"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Obra } from "@/lib/mock-data"
import { format, subMonths, startOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"

interface GlobalIntegrityTimelineProps {
  obras: Obra[]
  title?: string
}

export function GlobalIntegrityTimeline({
  obras,
  title = "Evolução da Integridade Média Global",
}: GlobalIntegrityTimelineProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calcular média global por mês
  const globalHistory = () => {
    if (obras.length === 0) return []

    // Usar data fixa para evitar hydration mismatch
    const baseDate = new Date('2025-01-22')
    const monthsToShow = 6 // Últimos 6 meses
    const monthlyData: Array<{ date: string; integrity: number }> = []

    // Gerar dados para os últimos 6 meses
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthDate = startOfMonth(subMonths(baseDate, i))
      const monthKey = format(monthDate, "yyyy-MM")
      
      // Calcular integridade média com variação para cada mês
      const baseIntegrity = obras.reduce((acc, obra) => acc + obra.integrity, 0) / obras.length
      
      // Adicionar variação determinística baseada no mês para simular histórico
      const variation = Math.sin(i * 0.5) * 5 - i * 0.8
      const monthIntegrity = Math.max(40, Math.min(95, Math.round(baseIntegrity + variation)))
      
      monthlyData.push({
        date: monthKey,
        integrity: monthIntegrity,
      })
    }

    return monthlyData
  }

  const data = globalHistory()

  // Formatar dados para exibição
  const formattedData = data.map((item) => ({
    ...item,
    dateFormatted: format(new Date(item.date + "-01"), "MMM/yy", { locale: ptBR }),
  }))

  // Calcular tendência
  const calcularTendencia = () => {
    if (data.length < 2) return { valor: 0, tipo: "estavel" }

    const primeiroValor = data[0].integrity
    const ultimoValor = data[data.length - 1].integrity
    const diferenca = ultimoValor - primeiroValor

    return {
      valor: Math.abs(diferenca).toFixed(1),
      tipo: diferenca > 0.5 ? "alta" : diferenca < -0.5 ? "baixa" : "estavel",
    }
  }

  const tendencia = calcularTendencia()
  const integridadeAtual = data.length > 0 ? data[data.length - 1].integrity : 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">Últimos 6 meses</p>
        </div>
        {data.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Integridade Atual</p>
            <p
              className={`text-2xl font-bold ${
                integridadeAtual >= 70
                  ? "text-green-600"
                  : integridadeAtual >= 40
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {integridadeAtual}%
            </p>
            <div className="mt-1 flex items-center justify-end gap-1">
              <span
                className={`text-xs font-medium ${
                  tendencia.tipo === "alta"
                    ? "text-green-600"
                    : tendencia.tipo === "baixa"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {tendencia.tipo === "alta" && "↑"}
                {tendencia.tipo === "baixa" && "↓"}
                {tendencia.tipo === "estavel" && "→"}
                {tendencia.tipo === "alta"
                  ? " Em alta"
                  : tendencia.tipo === "baixa"
                  ? " Em baixa"
                  : " Estável"}
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
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="dateFormatted"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              label={{
                value: "Integridade (%)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: "12px", fill: "#6b7280" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              formatter={(value: number) => [`${value}%`, "Integridade Média"]}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="integrity"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Integridade Média"
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Insight adicional */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Baseado em {obras.length} obra{obras.length !== 1 ? "s" : ""} monitorada
          {obras.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  )
}

