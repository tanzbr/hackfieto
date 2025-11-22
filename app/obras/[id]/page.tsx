"use client"

import { useState, use } from "react"
import { mockObras, getBlocksForObra, type Block } from "@/lib/mock-data"
import { BlockGrid3D } from "@/components/block-grid-3d"
import { SidebarCard, WorkInfo, BlockInfo } from "@/components/sidebar-card"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function ObraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const { id } = use(params)

  const obra = mockObras.find((o) => o.id === id)

  if (!obra) {
    notFound()
  }

  const blocks = getBlocksForObra(obra.id)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/obras" className="text-2xl font-bold text-gray-900">
              EcoBlock Monitor
            </Link>
            
            <nav className="flex gap-6">
              <Link href="/obras" className="text-sm font-medium text-gray-900 hover:text-gray-600">
                Minhas Obras
              </Link>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Relatórios
              </a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Configurações
              </a>
            </nav>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">João Silva</div>
                <div className="text-xs text-gray-500">Engenheiro Civil</div>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                JS
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Visualização 3D */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{obra.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Visualização 3D dos blocos inteligentes</p>
            </div>
            <div className="flex-1 relative">
              <BlockGrid3D blocks={blocks} onBlockSelect={setSelectedBlock} selectedBlock={selectedBlock} />
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white border border-gray-300" />
                  <span className="text-gray-600">Bom (≥70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span className="text-gray-600">Alerta (40-69%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-gray-600">Crítico ({"<"}40%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar com Cards */}
        <div className="w-96 bg-gray-50 p-6 overflow-y-auto space-y-6">
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
      </main>
    </div>
  )
}
