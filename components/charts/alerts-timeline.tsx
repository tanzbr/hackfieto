"use client"

import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { mockNotifications } from "@/lib/mock-data"
import { format, subMonths, startOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AlertsTimelineProps {
  title?: string
}

export function AlertsTimeline({
  title = "Volume de Alertas por Período",
}: AlertsTimelineProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Agrupar notificações por mês e tipo
  const getAlertsData = () => {
    // Usar data fixa para evitar hydration mismatch
    const baseDate = new Date('2025-01-22')
    const monthsToShow = 6 // Últimos 6 meses

    // Criar estrutura de dados para os últimos 6 meses
    const dateMap = new Map<
      string,
      { critical: number; warning: number; info: number }
    >()

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthDate = startOfMonth(subMonths(baseDate, i))
      const dateKey = format(monthDate, "yyyy-MM")
      dateMap.set(dateKey, { critical: 0, warning: 0, info: 0 })
    }

    // Contar notificações por mês e tipo (simulando dados distribuídos)
    Array.from(dateMap.keys()).forEach((monthKey, index) => {
      const counts = dateMap.get(monthKey)!
      
      // Simular dados de alertas por mês com variação determinística
      // Usando padrões fixos baseados no índice para evitar hydration mismatch
      const seededValue = (index * 7 + 13) % 10 // Gera valores pseudo-aleatórios mas consistentes
      const baseCritical = Math.floor(seededValue / 3) + (index % 2)
      const baseWarning = Math.floor(seededValue / 2.5) + (index % 3)
      const baseInfo = Math.floor(seededValue / 2) + ((index + 1) % 3)
      
      counts.critical = baseCritical
      counts.warning = baseWarning
      counts.info = baseInfo
    })

    // Converter para array para o gráfico
    return Array.from(dateMap.entries())
      .map(([date, counts]) => ({
        date,
        dateFormatted: format(new Date(date + "-01"), "MMM/yy", { locale: ptBR }),
        critical: counts.critical,
        warning: counts.warning,
        info: counts.info,
        total: counts.critical + counts.warning + counts.info,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  const data = getAlertsData()

  // Calcular estatísticas
  const totalAlertas = data.reduce((acc, d) => acc + d.total, 0)
  const mediaMensal = (totalAlertas / data.length).toFixed(1)
  const alertasCriticos = data.reduce((acc, d) => acc + d.critical, 0)
  const alertasWarning = data.reduce((acc, d) => acc + d.warning, 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">Últimos 6 meses</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total de Alertas</p>
          <p className="text-2xl font-bold text-gray-900">{totalAlertas}</p>
          <p className="text-xs text-gray-500 mt-1">
            Média: {mediaMensal}/mês
          </p>
        </div>
      </div>

      {!isClient ? (
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="text-gray-500">Carregando gráfico...</div>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorInfo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
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
                allowDecimals={false}
                label={{
                  value: "Quantidade",
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
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    critical: "Críticos",
                    warning: "Avisos",
                    info: "Informativos",
                  }
                  return [value, labels[name] || name]
                }}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value: string) => {
                  const labels: Record<string, string> = {
                    critical: "Críticos",
                    warning: "Avisos",
                    info: "Informativos",
                  }
                  return labels[value] || value
                }}
              />
              <Area
                type="monotone"
                dataKey="critical"
                stackId="1"
                stroke="#ef4444"
                fill="url(#colorCritical)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="warning"
                stackId="1"
                stroke="#f59e0b"
                fill="url(#colorWarning)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="info"
                stackId="1"
                stroke="#3b82f6"
                fill="url(#colorInfo)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Estatísticas */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <p className="text-xs text-gray-500">Críticos</p>
                </div>
                <p className="text-lg font-bold text-red-600">{alertasCriticos}</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded bg-yellow-500" />
                  <p className="text-xs text-gray-500">Avisos</p>
                </div>
                <p className="text-lg font-bold text-yellow-600">{alertasWarning}</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <p className="text-xs text-gray-500">Informativos</p>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  {totalAlertas - alertasCriticos - alertasWarning}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

