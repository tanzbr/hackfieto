import { mockObras } from "@/lib/mock-data"
import { DashboardHero } from "@/components/dashboard-hero"
import Link from "next/link"

export default function ObrasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHero obras={mockObras} />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>EcoBlock Monitor - Desafio Industrial FIETO</p>
            <p className="mt-1">Economia Circular na Construção Civil - Tocantins</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
