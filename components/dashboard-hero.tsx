"use client"

import { useState } from "react"
import Link from "next/link"
import type { Obra } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface DashboardHeroProps {
  obras: Obra[]
}

export function DashboardHero({ obras }: DashboardHeroProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "warning" | "critical">("all")

  // Cálculo de métricas
  const obrasAtivas = obras.filter(o => o.status === "active").length
  const totalBlocos = obras.length * 400
  const alertasPendentes = obras.filter(o => o.status === "warning" || o.status === "critical").length
  const taxaEficiencia = Math.round(obras.reduce((acc, o) => acc + o.integrity, 0) / obras.length)

  // Filtrar obras por status
  const obrasFiltradas = statusFilter === "all" 
    ? obras 
    : obras.filter(o => o.status === statusFilter)

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Visão Geral
          </h1>
          <p className="text-sm text-gray-500">
            Monitoramento em tempo real das suas obras
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Obras Ativas
              </p>
              <p className="text-2xl font-semibold text-gray-900">{obrasAtivas}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blocos Ativos
              </p>
              <p className="text-2xl font-semibold text-gray-900">{totalBlocos.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alertas
              </p>
              <p className="text-2xl font-semibold text-gray-900">{alertasPendentes}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Integridade Média
              </p>
              <p className="text-2xl font-semibold text-gray-900">{taxaEficiencia}%</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Obras com Filtros */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Header com Filtros */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">Obras Recentes</h2>
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

        {/* Lista */}
        <div className="divide-y divide-gray-200">
          {obrasFiltradas.map((obra) => (
            <Link
              key={obra.id}
              href={`/obras/${obra.id}`}
              className="block px-6 py-4 hover:bg-gray-50 transition-colors"
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
                
                <div className="flex items-center gap-8">
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

