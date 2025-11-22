"use client"

import { useState, useRef, useEffect } from "react"
import { Obra, Block, IntegrityHistoryPoint } from "@/lib/mock-data"
import { downloadObraPDF } from "@/lib/export/pdf-generator"
import { downloadObraExcel, generateObrasComparisonExcel } from "@/lib/export/excel-generator"
import toast from "react-hot-toast"

interface ExportButtonProps {
  obra?: Obra
  obras?: Obra[]
  blocks?: Block[]
  history?: IntegrityHistoryPoint[]
  variant?: "single" | "multiple"
}

export function ExportButton({ obra, obras, blocks, history, variant = "single" }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleExportPDF = () => {
    if (variant === "single" && obra && blocks && history) {
      try {
        downloadObraPDF(obra, blocks, history)
        toast.success("Relatório PDF gerado com sucesso!")
        setIsOpen(false)
      } catch (error) {
        toast.error("Erro ao gerar relatório PDF")
        console.error(error)
      }
    }
  }

  const handleExportExcel = () => {
    try {
      if (variant === "single" && obra && blocks && history) {
        downloadObraExcel(obra, blocks, history)
        toast.success("Relatório Excel gerado com sucesso!")
      } else if (variant === "multiple" && obras) {
        generateObrasComparisonExcel(obras)
        toast.success("Comparação de obras exportada com sucesso!")
      }
      setIsOpen(false)
    } catch (error) {
      toast.error("Erro ao gerar relatório Excel")
      console.error(error)
    }
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Exportar Relatório
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
            Selecione o formato
          </div>
          
          <button
            onClick={handleExportPDF}
            disabled={variant === "multiple"}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Exportar como PDF</p>
              <p className="text-xs text-gray-500">Relatório completo formatado</p>
            </div>
          </button>

          <button
            onClick={handleExportExcel}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Exportar como Excel</p>
              <p className="text-xs text-gray-500">Dados em planilha editável</p>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

