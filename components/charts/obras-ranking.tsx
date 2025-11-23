"use client"

import { Obra } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ObrasRankingProps {
  obras: Obra[]
  title?: string
}

export function ObrasRanking({ obras, title = "Ranking de Obras" }: ObrasRankingProps) {
  // Ordenar obras por integridade
  const obrasSorted = [...obras].sort((a, b) => b.integrity - a.integrity)

  // Top 3 melhores
  const topObras = obrasSorted.slice(0, 3)

  // Bottom 3 piores
  const bottomObras = obrasSorted.slice(-3).reverse()

  const renderObraCard = (obra: Obra, index: number, isTop: boolean) => {
    const posicao = isTop ? index + 1 : obras.length - index

    return (
      <Link
        key={obra.id}
        href={`/obras/${obra.id}`}
        className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover-lift transition-all bg-white"
      >
        <div className="flex items-center gap-3">
          {/* Posição */}
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
              isTop && index === 0
                ? "bg-yellow-100 text-yellow-700"
                : isTop && index === 1
                ? "bg-gray-100 text-gray-700"
                : isTop && index === 2
                ? "bg-orange-100 text-orange-700"
                : "bg-gray-50 text-gray-600"
            )}
          >
            {isTop && index === 0 && "🥇"}
            {isTop && index === 1 && "🥈"}
            {isTop && index === 2 && "🥉"}
            {!isTop && posicao}
          </div>

          {/* Informações */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {obra.name}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">{obra.location}</p>
          </div>

          {/* Badge de Integridade */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold text-sm",
                obra.integrity >= 70
                  ? "bg-green-100 text-green-700"
                  : obra.integrity >= 40
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {obra.integrity}%
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all",
              obra.integrity >= 70
                ? "bg-green-500"
                : obra.integrity >= 40
                ? "bg-yellow-500"
                : "bg-red-500"
            )}
            style={{ width: `${obra.integrity}%` }}
          />
        </div>
      </Link>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="space-y-6">
        {/* Top 3 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-700">
              Melhores Desempenhos
            </h4>
          </div>
          <div className="space-y-2">
            {topObras.map((obra, index) => renderObraCard(obra, index, true))}
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-200" />

        {/* Bottom 3 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded">
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-700">
              Requerem Atenção
            </h4>
          </div>
          <div className="space-y-2">
            {bottomObras.map((obra, index) => renderObraCard(obra, index, false))}
          </div>
        </div>
      </div>

      {/* Nota */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Clique em uma obra para ver detalhes completos
        </p>
      </div>
    </div>
  )
}


