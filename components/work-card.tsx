import Link from "next/link"
import type { Obra } from "@/lib/mock-data"

interface WorkCardProps {
  obra: Obra
}

export function WorkCard({ obra }: WorkCardProps) {
  const getStatusColor = () => {
    if (obra.integrity >= 70) return "bg-green-500"
    if (obra.integrity >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Link href={`/obras/${obra.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Nome e localização */}
          <div className="col-span-4">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{obra.name}</h3>
            <p className="text-sm text-gray-500">{obra.location}</p>
          </div>
          
          {/* Barra de progresso */}
          <div className="col-span-3">
            <div className="text-xs text-gray-600 mb-1">Integridade</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${getStatusColor()}`} style={{ width: `${obra.integrity}%` }} />
            </div>
          </div>
          
          {/* Porcentagem */}
          <div className="col-span-2 text-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor()}`}>
              {obra.integrity}%
            </span>
          </div>
          
          {/* Última atualização */}
          <div className="col-span-3 text-right">
            <div className="text-xs text-gray-500">
              Atualizado em
            </div>
            <div className="text-xs font-medium text-gray-700">
              {new Date(obra.lastUpdate).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
