import { mockObras } from "@/lib/mock-data"
import { DashboardHero } from "@/components/dashboard-hero"
import { AppHeader } from "@/components/app-header"
import { ObrasComparison } from "@/components/charts/obras-comparison"
import { ObraComparison } from "@/components/obra-comparison"

export default function ObrasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DashboardHero obras={mockObras} />
        
        {/* Gráfico de comparação */}
        <ObrasComparison obras={mockObras} />

        {/* Comparador interativo de obras */}
        <ObraComparison obras={mockObras} />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>Nexfloor - Desafio Industrial FIETO</p>
            <p className="mt-1">Economia Circular na Construção Civil - Tocantins</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
