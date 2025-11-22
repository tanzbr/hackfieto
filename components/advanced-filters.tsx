"use client"

import { useState } from "react"
import { Obra } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface AdvancedFiltersProps {
  obras: Obra[]
  onFilterChange: (filtered: Obra[]) => void
}

type SortOption = "name" | "integrity-desc" | "integrity-asc" | "location" | "recent"

export function AdvancedFilters({ obras, onFilterChange }: AdvancedFiltersProps) {
  const [integrityRange, setIntegrityRange] = useState<[number, number]>([0, 100])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [showFilters, setShowFilters] = useState(false)

  // Extrai cidades únicas
  const locations = Array.from(new Set(obras.map(o => o.location.split(" - ")[0])))

  const applyFilters = () => {
    let filtered = obras.filter(obra => {
      // Filtro de integridade
      if (obra.integrity < integrityRange[0] || obra.integrity > integrityRange[1]) {
        return false
      }

      // Filtro de localização
      if (selectedLocations.length > 0) {
        const obraCity = obra.location.split(" - ")[0]
        if (!selectedLocations.includes(obraCity)) {
          return false
        }
      }

      return true
    })

    // Ordenação
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "integrity-desc":
        filtered.sort((a, b) => b.integrity - a.integrity)
        break
      case "integrity-asc":
        filtered.sort((a, b) => a.integrity - b.integrity)
        break
      case "location":
        filtered.sort((a, b) => a.location.localeCompare(b.location))
        break
      case "recent":
        filtered.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        break
    }

    onFilterChange(filtered)
  }

  const resetFilters = () => {
    setIntegrityRange([0, 100])
    setSelectedLocations([])
    setSortBy("recent")
    onFilterChange(obras)
  }

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => {
      const newSelection = prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
      return newSelection
    })
  }

  const hasActiveFilters = 
    integrityRange[0] !== 0 || 
    integrityRange[1] !== 100 || 
    selectedLocations.length > 0 ||
    sortBy !== "recent"

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              showFilters
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros Avançados
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                !
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Ordenação rápida */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption)
              setTimeout(applyFilters, 0)
            }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Mais Recentes</option>
            <option value="name">Nome (A-Z)</option>
            <option value="integrity-desc">Maior Integridade</option>
            <option value="integrity-asc">Menor Integridade</option>
            <option value="location">Localização</option>
          </select>
        </div>
      </div>

      {/* Painel de filtros expandido */}
      {showFilters && (
        <div className="pt-4 border-t border-gray-200 space-y-6">
          {/* Filtro de Integridade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Faixa de Integridade: {integrityRange[0]}% - {integrityRange[1]}%
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={integrityRange[0]}
                onChange={(e) => setIntegrityRange([Number(e.target.value), integrityRange[1]])}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={integrityRange[1]}
                onChange={(e) => setIntegrityRange([integrityRange[0], Number(e.target.value)])}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Filtro de Localização */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Localização
            </label>
            <div className="flex flex-wrap gap-2">
              {locations.map(location => (
                <button
                  key={location}
                  onClick={() => toggleLocation(location)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                    selectedLocations.includes(location)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  )}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Botão Aplicar */}
          <div className="flex justify-end">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

