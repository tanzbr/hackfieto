"use client"

import { useState, use } from "react"
import { mockObras, getBlocksForObra, getIntegrityHistoryForObra, type Block } from "@/lib/mock-data"
import { BlockGrid3D } from "@/components/block-grid-3d"
import { SidebarCard, WorkInfo, BlockInfo } from "@/components/sidebar-card"
import { AppHeader } from "@/components/app-header"
import { IntegrityTimeline } from "@/components/charts/integrity-timeline"
import { StatusDistribution } from "@/components/charts/status-distribution"
import { Heatmap } from "@/components/charts/heatmap"
import { ExportButton } from "@/components/export-button"
import { QuickActionsMenu } from "@/components/quick-actions-menu"
import { notFound } from "next/navigation"
import Link from "next/link"

export default function ObraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const { id } = use(params)

  const obra = mockObras.find((o) => o.id === id)

  if (!obra) {
    notFound()
  }

  const blocks = getBlocksForObra(obra.id)
  const history = getIntegrityHistoryForObra(obra.id)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="Detalhes da Obra" />

      <main className="flex-1 overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-16 py-6 space-y-6">
          {/* Breadcrumbs e ações */}
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/obras" className="text-gray-500 hover:text-gray-700">
                Obras
              </Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">{obra.name}</span>
            </nav>
            <div className="flex items-center gap-3">
              <QuickActionsMenu obra={obra} blocks={blocks} history={history} />
              <ExportButton obra={obra} blocks={blocks} history={history} variant="single" />
            </div>
          </div>

          {/* Cabeçalho da Obra */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">{obra.name}</h1>
            <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{obra.location}</span>
              </div>
              {obra.area && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                  <span>{obra.area} m²</span>
                </div>
              )}
              {obra.responsavel && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{obra.responsavel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Visualizações 3D e 2D */}
          <div className="grid grid-cols-3 gap-6">
            {/* Visualização 3D */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 h-[600px] flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Visualização 3D</h2>
                  <p className="text-sm text-gray-600 mt-1">Clique em um bloco para ver detalhes</p>
                </div>
                <div className="flex-1 relative overflow-hidden">
                  <BlockGrid3D blocks={blocks} onBlockSelect={setSelectedBlock} selectedBlock={selectedBlock} />
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Clique em um bloco para visualizar informações de integridade
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-3 bg-yellow-500 rounded shadow-sm"></div>
                        <span className="text-xs font-medium text-gray-700">Alerta (40-69%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-3 bg-red-500 rounded shadow-sm animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-700">Crítico (&lt;40%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar com Cards */}
            <div className="space-y-6">
              <SidebarCard title="Informações da Obra">
                <WorkInfo
                  name={obra.name}
                  id={obra.id}
                  integrity={obra.integrity}
                  location={obra.location}
                  lastUpdate={obra.lastUpdate}
                />
              </SidebarCard>

              <SidebarCard title="Bloco Selecionado">
                <BlockInfo block={selectedBlock} />
              </SidebarCard>
            </div>
          </div>

          {/* Grid de Gráficos */}
          <div className="grid grid-cols-2 gap-6">
            <IntegrityTimeline data={history} />
            <StatusDistribution blocks={blocks} />
          </div>

          {/* Mapa de Calor */}
          <Heatmap blocks={blocks} />
        </div>
      </main>
    </div>
  )
}
