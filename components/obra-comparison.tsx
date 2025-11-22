"use client"

import { useState } from "react"
import { Obra } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { generateObrasComparisonExcel } from "@/lib/export/excel-generator"
import toast from "react-hot-toast"

interface ObraComparisonProps {
  obras: Obra[]
}

export function ObraComparison({ obras }: ObraComparisonProps) {
  const [selectedObras, setSelectedObras] = useState<string[]>([])
  const [isComparing, setIsComparing] = useState(false)

  const toggleObraSelection = (obraId: string) => {
    setSelectedObras(prev => {
      if (prev.includes(obraId)) {
        return prev.filter(id => id !== obraId)
      } else {
        if (prev.length >= 4) {
          toast.error("Você pode selecionar no máximo 4 obras para comparar")
          return prev
        }
        return [...prev, obraId]
      }
    })
  }

  const handleCompare = () => {
    if (selectedObras.length < 2) {
      toast.error("Selecione pelo menos 2 obras para comparar")
      return
    }
    setIsComparing(true)
  }

  const handleExport = () => {
    const obrasToExport = obras.filter(o => selectedObras.includes(o.id))
    generateObrasComparisonExcel(obrasToExport)
    toast.success("Comparação exportada com sucesso!")
  }

  const selectedObrasData = obras.filter(o => selectedObras.includes(o.id))

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Comparação de Obras</h3>
            <p className="text-sm text-gray-500 mt-1">
              Selecione até 4 obras para comparar
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedObras.length > 0 && (
              <button
                onClick={() => setSelectedObras([])}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Limpar ({selectedObras.length})
              </button>
            )}
            <button
              onClick={handleCompare}
              disabled={selectedObras.length < 2}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                selectedObras.length >= 2
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              Comparar Selecionadas
            </button>
          </div>
        </div>
      </div>

      {!isComparing ? (
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {obras.map((obra) => (
              <button
                key={obra.id}
                onClick={() => toggleObraSelection(obra.id)}
                className={cn(
                  "p-4 border-2 rounded-lg text-left transition-all hover-lift",
                  selectedObras.includes(obra.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1",
                    obra.status === "active" ? "bg-green-500" :
                    obra.status === "warning" ? "bg-yellow-500" :
                    "bg-red-500"
                  )} />
                  {selectedObras.includes(obra.id) && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {obra.name}
                </h4>
                <p className="text-xs text-gray-500 mb-2">{obra.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Integridade</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    obra.integrity >= 70 ? "text-green-600" :
                    obra.integrity >= 40 ? "text-yellow-600" :
                    "text-red-600"
                  )}>
                    {obra.integrity}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-md font-semibold text-gray-900">
              Comparando {selectedObrasData.length} obras
            </h4>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Exportar Comparação
              </button>
              <button
                onClick={() => setIsComparing(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Voltar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Métrica</th>
                  {selectedObrasData.map((obra) => (
                    <th key={obra.id} className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                      <Link href={`/obras/${obra.id}`} className="hover:text-blue-600">
                        {obra.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-600">Localização</td>
                  {selectedObrasData.map((obra) => (
                    <td key={obra.id} className="py-3 px-4 text-sm text-gray-900">
                      {obra.location}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-600">Integridade</td>
                  {selectedObrasData.map((obra) => (
                    <td key={obra.id} className="py-3 px-4">
                      <span className={cn(
                        "text-sm font-semibold",
                        obra.integrity >= 70 ? "text-green-600" :
                        obra.integrity >= 40 ? "text-yellow-600" :
                        "text-red-600"
                      )}>
                        {obra.integrity}%
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-600">Status</td>
                  {selectedObrasData.map((obra) => (
                    <td key={obra.id} className="py-3 px-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 text-xs font-medium rounded",
                        obra.status === "active" ? "bg-green-50 text-green-700" :
                        obra.status === "warning" ? "bg-yellow-50 text-yellow-700" :
                        "bg-red-50 text-red-700"
                      )}>
                        {obra.status === "active" ? "Ativo" : obra.status === "warning" ? "Atenção" : "Crítico"}
                      </span>
                    </td>
                  ))}
                </tr>
                {selectedObrasData.some(o => o.area) && (
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">Área</td>
                    {selectedObrasData.map((obra) => (
                      <td key={obra.id} className="py-3 px-4 text-sm text-gray-900">
                        {obra.area ? `${obra.area} m²` : '--'}
                      </td>
                    ))}
                  </tr>
                )}
                {selectedObrasData.some(o => o.responsavel) && (
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-600">Responsável</td>
                    {selectedObrasData.map((obra) => (
                      <td key={obra.id} className="py-3 px-4 text-sm text-gray-900">
                        {obra.responsavel || '--'}
                      </td>
                    ))}
                  </tr>
                )}
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">Última Atualização</td>
                  {selectedObrasData.map((obra) => (
                    <td key={obra.id} className="py-3 px-4 text-sm text-gray-900">
                      {new Date(obra.lastUpdate).toLocaleDateString('pt-BR')}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

