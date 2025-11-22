import type React from "react"
import { type Block, getBlockStatus, getBlockColor } from "@/lib/mock-data"

interface SidebarCardProps {
  title: string
  children: React.ReactNode
}

export function SidebarCard({ title, children }: SidebarCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

interface WorkInfoProps {
  name: string
  id: string
  integrity: number
  location: string
  lastUpdate: string
}

export function WorkInfo({ name, id, integrity, location, lastUpdate }: WorkInfoProps) {
  return (
    <div className="space-y-3">
      <div>
        <span className="text-sm text-gray-600">Nome:</span>
        <p className="text-base font-medium text-gray-900">{name}</p>
      </div>
      <div>
        <span className="text-sm text-gray-600">ID:</span>
        <p className="text-base font-medium text-gray-900">{id}</p>
      </div>
      <div>
        <span className="text-sm text-gray-600">Localização:</span>
        <p className="text-base font-medium text-gray-900">{location}</p>
      </div>
      <div>
        <span className="text-sm text-gray-600">Integridade Geral:</span>
        <p className="text-base font-medium text-gray-900">{integrity}%</p>
      </div>
      <div>
        <span className="text-sm text-gray-600">Última Atualização:</span>
        <p className="text-base font-medium text-gray-900">{new Date(lastUpdate).toLocaleDateString("pt-BR")}</p>
      </div>
    </div>
  )
}

interface BlockInfoProps {
  block: Block | null
}

export function BlockInfo({ block }: BlockInfoProps) {
  if (!block) {
    return <div className="text-center py-8 text-gray-500">Selecione um bloco no modelo 3D</div>
  }

  const status = getBlockStatus(block.integrity)
  const color = getBlockColor(block.integrity)

  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm text-gray-600">Posição:</span>
        <p className="text-base font-medium text-gray-900">
          X: {block.x}, Y: {block.y}
        </p>
      </div>
      <div>
        <span className="text-sm text-gray-600">Integridade:</span>
        <p className="text-base font-medium text-gray-900">{block.integrity}%</p>
      </div>
      <div>
        <span className="text-sm text-gray-600">Status:</span>
        <p className="text-base font-medium text-gray-900">{status}</p>
      </div>
      <div>
        <span className="text-sm text-gray-600">Indicador de Cor:</span>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-12 rounded border-2 border-gray-300" style={{ backgroundColor: color }} />
          <span className="text-sm text-gray-600">{status}</span>
        </div>
      </div>
      <div className="pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">Sensores: Piezoelétrico + Giroscópio</span>
      </div>
    </div>
  )
}
