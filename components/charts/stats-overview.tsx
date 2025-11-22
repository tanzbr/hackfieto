"use client"

import { Obra } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface StatsOverviewProps {
  obras: Obra[]
}

export function StatsOverview({ obras }: StatsOverviewProps) {
  // Calcular métricas
  const totalObras = obras.length
  const integridadeMedia = Math.round(
    obras.reduce((acc, obra) => acc + obra.integrity, 0) / obras.length
  )
  const totalBlocos = obras.reduce((acc, obra) => acc + (obra.totalBlocos || 100), 0)
  const obrasAtencao = obras.filter(
    (o) => o.status === "warning" || o.status === "critical"
  ).length

  // Calcular tendência (comparando obras acima e abaixo da média)
  const obrasAcimaMedia = obras.filter((o) => o.integrity >= integridadeMedia).length
  const tendencia = obrasAcimaMedia >= totalObras / 2 ? "positiva" : "negativa"

  const stats = [
    {
      label: "Integridade Média Global",
      value: `${integridadeMedia}%`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: integridadeMedia >= 70 ? "green" : integridadeMedia >= 40 ? "yellow" : "red",
      bgColor: integridadeMedia >= 70 ? "bg-green-50" : integridadeMedia >= 40 ? "bg-yellow-50" : "bg-red-50",
      textColor: integridadeMedia >= 70 ? "text-green-600" : integridadeMedia >= 40 ? "text-yellow-600" : "text-red-600",
      iconColor: integridadeMedia >= 70 ? "text-green-600" : integridadeMedia >= 40 ? "text-yellow-600" : "text-red-600",
    },
    {
      label: "Total de Obras Monitoradas",
      value: totalObras.toString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      iconColor: "text-blue-600",
    },
    {
      label: "Total de Blocos Instalados",
      value: totalBlocos.toLocaleString("pt-BR"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
          />
        </svg>
      ),
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      iconColor: "text-purple-600",
    },
    {
      label: "Obras que Necessitam Atenção",
      value: obrasAtencao.toString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      color: "orange",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-6 hover-lift animate-slide-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <p className={cn("text-3xl font-bold", stat.textColor)}>{stat.value}</p>
              
              {index === 0 && (
                <div className="mt-2 flex items-center gap-1">
                  <span className={cn(
                    "text-xs font-medium",
                    tendencia === "positiva" ? "text-green-600" : "text-red-600"
                  )}>
                    {tendencia === "positiva" ? "↑" : "↓"} Tendência {tendencia}
                  </span>
                </div>
              )}
              
              {index === 3 && obrasAtencao > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    {Math.round((obrasAtencao / totalObras) * 100)}% do total
                  </span>
                </div>
              )}
            </div>
            <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", stat.bgColor)}>
              <div className={stat.iconColor}>{stat.icon}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

