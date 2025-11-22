import { mockObras } from "@/lib/mock-data"
import { AppHeader } from "@/components/app-header"
import { ObrasComparison } from "@/components/charts/obras-comparison"
import { ObraComparison } from "@/components/obra-comparison"
import { GlobalIntegrityTimeline } from "@/components/charts/global-integrity-timeline"
import { AlertsTimeline } from "@/components/charts/alerts-timeline"
import { ObrasStatusDistribution } from "@/components/charts/obras-status-distribution"

export default function EstatisticasPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Cabeçalho */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Estatísticas</h1>
          <p className="text-sm text-gray-500">
            Análise comparativa e visualização de dados das obras
          </p>
        </div>

        {/* Seção: Análise Temporal */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Análise Temporal</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlobalIntegrityTimeline obras={mockObras} />
            <AlertsTimeline />
          </div>
        </section>

        {/* Seção: Distribuição e Status */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribuição e Status</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ObrasComparison obras={mockObras} />
            <ObrasStatusDistribution obras={mockObras} />
          </div>
        </section>

        {/* Seção: Comparação Detalhada */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparação Detalhada</h2>
          <ObraComparison obras={mockObras} />
        </section>
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

