"use client"

import { Block, getBlockColor } from '@/lib/mock-data'
import { useState, useEffect } from 'react'

interface HeatmapProps {
  blocks: Block[]
  title?: string
  size?: number
  onBlockSelect?: (block: Block | null) => void
}

export function Heatmap({ blocks, title = "Mapa de Calor - Integridade dos Blocos", size = 10, onBlockSelect }: HeatmapProps) {
  const [hoveredBlock, setHoveredBlock] = useState<Block | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Organiza blocos em uma matriz
  const grid: (Block | null)[][] = Array(size).fill(null).map(() => Array(size).fill(null))
  blocks.forEach(block => {
    if (block.x < size && block.y < size) {
      grid[block.y][block.x] = block
    }
  })

  const cellSize = Math.min(20, 400 / size)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {!isClient ? (
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="text-gray-500">Carregando mapa de calor...</div>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Mapa de calor */}
          <div className="flex-1">
            <div className="inline-block border border-gray-300 rounded">
              {grid.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((block, x) => (
                    <div
                      key={`${x}-${y}`}
                      className="border-r border-b border-gray-200 cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 hover:z-10 relative"
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        backgroundColor: block ? getBlockColor(block.integrity) : '#f3f4f6',
                      }}
                      onMouseEnter={() => block && setHoveredBlock(block)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      onClick={() => block && onBlockSelect?.(block)}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Info do bloco ao passar o mouse */}
            {hoveredBlock && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-600">Posição:</span>{' '}
                  <span className="font-medium text-gray-900">
                    X: {hoveredBlock.x}, Y: {hoveredBlock.y}
                  </span>
                </div>
                <div className="text-sm mt-1">
                  <span className="text-gray-600">Integridade:</span>{' '}
                  <span className={`font-semibold ${
                    hoveredBlock.integrity >= 70 ? 'text-green-600' :
                    hoveredBlock.integrity >= 40 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {hoveredBlock.integrity}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Legenda */}
          <div className="w-48 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Legenda</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: '#22c55e' }} />
                  <span className="text-sm text-gray-600">Bom (≥70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: '#f59e0b' }} />
                  <span className="text-sm text-gray-600">Alerta (40-69%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: '#dc2626' }} />
                  <span className="text-sm text-gray-600">Crítico (&lt;40%)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Estatísticas</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium text-gray-900">{blocks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bom:</span>
                  <span className="font-medium text-green-600">
                    {blocks.filter(b => b.integrity >= 70).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alerta:</span>
                  <span className="font-medium text-yellow-600">
                    {blocks.filter(b => b.integrity >= 40 && b.integrity < 70).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crítico:</span>
                  <span className="font-medium text-red-600">
                    {blocks.filter(b => b.integrity < 40).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

