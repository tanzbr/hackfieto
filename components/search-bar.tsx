"use client"

import { useState, useEffect, useRef } from "react"
import { Obra } from "@/lib/mock-data"
import Link from "next/link"

interface SearchBarProps {
  obras: Obra[]
  placeholder?: string
}

export function SearchBar({ obras, placeholder = "Buscar obras por nome, localização ou ID..." }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Carrega buscas recentes do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredObras = searchTerm.length > 0
    ? obras.filter(obra =>
        obra.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obra.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obra.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  const handleSearch = (term: string) => {
    if (term && !recentSearches.includes(term)) {
      const updated = [term, ...recentSearches.slice(0, 4)]
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <svg
          className="absolute left-3 top-3 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {searchTerm.length > 0 ? (
            <>
              {filteredObras.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Resultados ({filteredObras.length})
                  </div>
                  {filteredObras.map((obra) => (
                    <Link
                      key={obra.id}
                      href={`/obras/${obra.id}`}
                      onClick={() => {
                        handleSearch(searchTerm)
                        setIsOpen(false)
                        setSearchTerm("")
                      }}
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{obra.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{obra.location} • ID: {obra.id}</p>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                            obra.status === "active" ? "bg-green-50 text-green-700" :
                            obra.status === "warning" ? "bg-yellow-50 text-yellow-700" :
                            "bg-red-50 text-red-700"
                          }`}>
                            {obra.integrity}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-sm text-gray-500">Nenhuma obra encontrada</p>
                  <p className="text-xs text-gray-400 mt-1">Tente buscar por outro termo</p>
                </div>
              )}
            </>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase">Buscas Recentes</span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Limpar
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(search)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-500">
                Digite para buscar obras por nome, localização ou ID
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

