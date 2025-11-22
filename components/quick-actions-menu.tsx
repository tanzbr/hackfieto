"use client"

import { useState, useRef, useEffect } from "react"
import { Obra, Block, IntegrityHistoryPoint } from "@/lib/mock-data"
import { downloadObraPDF } from "@/lib/export/pdf-generator"
import { downloadObraExcel } from "@/lib/export/excel-generator"
import toast from "react-hot-toast"
import Link from "next/link"

interface QuickActionsMenuProps {
  obra: Obra
  blocks?: Block[]
  history?: IntegrityHistoryPoint[]
}

export function QuickActionsMenu({ obra, blocks, history }: QuickActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleExportPDF = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (blocks && history) {
      try {
        downloadObraPDF(obra, blocks, history)
        toast.success("Relatório PDF gerado!")
        setIsOpen(false)
      } catch (error) {
        toast.error("Erro ao gerar PDF")
      }
    }
  }

  const handleExportExcel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (blocks && history) {
      try {
        downloadObraExcel(obra, blocks, history)
        toast.success("Relatório Excel gerado!")
        setIsOpen(false)
      } catch (error) {
        toast.error("Erro ao gerar Excel")
      }
    }
  }

  const handleScheduleMaintenance = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success("Manutenção agendada com sucesso!", {
      icon: "📅",
    })
    setIsOpen(false)
  }

  const handleConfigureAlerts = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success("Configurações de alerta atualizadas!", {
      icon: "🔔",
    })
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-scale-in">
          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
            Ações Rápidas
          </div>

          <Link
            href={`/obras/${obra.id}`}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Visualizar Detalhes
          </Link>

          {blocks && history && (
            <>
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Gerar Relatório PDF
              </button>

              <button
                onClick={handleExportExcel}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Exportar para Excel
              </button>
            </>
          )}

          <div className="border-t border-gray-200 my-2" />

          <button
            onClick={handleScheduleMaintenance}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Agendar Manutenção
          </button>

          <button
            onClick={handleConfigureAlerts}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Configurar Alertas
          </button>
        </div>
      )}
    </div>
  )
}

