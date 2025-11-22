"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { Obra } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { SearchBar } from "./search-bar"
import { Tooltip } from "./ui/tooltip"


type SortOption = "name" | "integrity-desc" | "integrity-asc" | "location" | "recent"

interface DashboardHeroProps {
  obras: Obra[]
}

export function DashboardHero({ obras }: DashboardHeroProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "warning" | "critical">("all")
  const [sortBy, setSortBy] = useState<SortOption>("recent")

  // Cálculo de métricas (usando obras originais)
  const obrasAtivas = obras.length
  const totalBlocos = obras.length * 400
  const alertasPendentes = obras.filter(o => o.status === "warning" || o.status === "critical").length
  const taxaEficiencia = Math.round(obras.reduce((acc, o) => acc + o.integrity, 0) / obras.length)

  // Filtrar e ordenar obras
  const obrasFiltradas = useMemo(() => {
    // Primeiro filtra por status
    let filtered = statusFilter === "all" 
      ? obras 
      : obras.filter(o => o.status === statusFilter)

    // Depois ordena
    const sorted = [...filtered]
    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "integrity-desc":
        sorted.sort((a, b) => b.integrity - a.integrity)
        break
      case "integrity-asc":
        sorted.sort((a, b) => a.integrity - b.integrity)
        break
      case "location":
        sorted.sort((a, b) => a.location.localeCompare(b.location))
        break
      case "recent":
        sorted.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        break
    }

    return sorted
  }, [obras, statusFilter, sortBy])

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            Monitoramento em tempo real das suas obras
          </p>
        </div>
        <SearchBar obras={obras} />
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-4">
        <Tooltip content="Total de obras com status ativo no sistema">
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover-lift cursor-help animate-slide-in-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obras Ativas
                </p>
                <p className="text-2xl font-semibold text-gray-900">{obrasAtivas}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content="Total de blocos inteligentes instalados em todas as obras">
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover-lift cursor-help animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blocos Ativos
                </p>
                <p className="text-2xl font-semibold text-gray-900">{totalBlocos.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content="Obras que requerem atenção ou estão em estado crítico">
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover-lift cursor-help animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alertas
                </p>
                <p className="text-2xl font-semibold text-gray-900">{alertasPendentes}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content="Média da integridade estrutural de todas as obras">
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover-lift cursor-help animate-slide-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Integridade Média
                </p>
                <p className="text-2xl font-semibold text-gray-900">{taxaEficiencia}%</p>
              </div>
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                taxaEficiencia >= 70 ? "bg-green-50" :
                taxaEficiencia >= 40 ? "bg-yellow-50" : "bg-red-50"
              )}>
                <svg className={cn(
                  "w-5 h-5",
                  taxaEficiencia >= 70 ? "text-green-600" :
                  taxaEficiencia >= 40 ? "text-yellow-600" : "text-red-600"
                )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Lista de Obras com Filtros */}
      <div id="obras-recentes" className="bg-white border border-gray-200 rounded-lg scroll-mt-24">
        {/* Header com Filtros e Ordenação */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">Obras Recentes</h2>
            <div className="flex items-center gap-4">
              {/* Ordenação */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="name">Nome (A-Z)</option>
                  <option value="integrity-desc">Maior Integridade</option>
                  <option value="integrity-asc">Menor Integridade</option>
                  <option value="location">Localização</option>
                </select>
              </div>

              {/* Filtros de Status */}
              <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  statusFilter === "all"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                Todas
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  statusFilter === "active"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                Ativas
              </button>
              <button
                onClick={() => setStatusFilter("warning")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  statusFilter === "warning"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                Atenção
              </button>
              <button
                onClick={() => setStatusFilter("critical")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  statusFilter === "critical"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                Críticas
              </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="divide-y divide-gray-200">
          {obrasFiltradas.map((obra, index) => (
            <div
              key={obra.id}
              onClick={() => router.push(`/obras/${obra.id}`)}
              className="block px-6 py-4 hover:bg-gray-50 transition-all-smooth hover-lift cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    obra.status === "active" ? "bg-green-500" :
                    obra.status === "warning" ? "bg-yellow-500" :
                    "bg-red-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {obra.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {obra.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Integridade</p>
                    <p className={cn(
                      "text-sm font-medium mt-0.5",
                      obra.integrity >= 70 ? "text-gray-900" :
                      obra.integrity >= 40 ? "text-gray-700" :
                      "text-gray-900"
                    )}>
                      {obra.integrity}%
                    </p>
                  </div>
                  
                  <div className="w-32 bg-gray-100 rounded-full h-1.5">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        obra.integrity >= 70 ? "bg-green-500" :
                        obra.integrity >= 40 ? "bg-yellow-500" :
                        "bg-red-500"
                      )}
                      style={{ width: `${obra.integrity}%` }}
                    />
                  </div>
                  

                  
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

