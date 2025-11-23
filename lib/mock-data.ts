export interface Obra {
  id: string
  name: string
  integrity: number // 0-100
  location: string
  status: "active" | "warning" | "critical"
  lastUpdate: string
  area?: number // metros quadrados
  year?: number // ano de instalação
  type?: string // tipo de obra
  responsavel?: string
  totalBlocos?: number
}

export interface Block {
  x: number
  y: number
  integrity: number // 0-100
}

export interface IntegrityHistoryPoint {
  date: string
  integrity: number
}

export interface Notification {
  id: string
  obraId: string
  obraName: string
  type: "critical" | "warning" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export interface Event {
  id: string
  obraId: string
  type: "maintenance" | "alert" | "inspection" | "repair"
  description: string
  timestamp: string
  user?: string
}

export interface AIInsight {
  id: string
  blockPosition: { x: number; y: number }
  title: string
  description: string
  severity: "critical" | "warning" | "info"
  metrics: {
    label: string
    value: string
  }[]
}

// Gera uma grade de blocos com integridades aleatórias
export function generateBlockGrid(size = 10): Block[] {
  const blocks: Block[] = []

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      blocks.push({
        x,
        y,
        integrity: Math.floor(Math.random() * 100),
      })
    }
  }

  return blocks
}

// Retorna cor baseada na integridade com gradiente
export function getBlockColor(integrity: number): string {
  // Verde (≥70%): variação de #86efac (70%) até #22c55e (100%)
  if (integrity >= 70) {
    const ratio = (integrity - 70) / 30 // 0 a 1
    const r = Math.round(134 + (34 - 134) * ratio)
    const g = Math.round(239 + (197 - 239) * ratio)
    const b = Math.round(172 + (94 - 172) * ratio)
    return `rgb(${r}, ${g}, ${b})`
  }
  
  // Amarelo (40-69%): variação de #fcd34d (40%) até #f59e0b (69%)
  if (integrity >= 40) {
    const ratio = (integrity - 40) / 29 // 0 a 1
    const r = Math.round(252 + (245 - 252) * ratio)
    const g = Math.round(211 + (158 - 211) * ratio)
    const b = Math.round(77 + (11 - 77) * ratio)
    return `rgb(${r}, ${g}, ${b})`
  }
  
  // Vermelho (<40%): variação de #fca5a5 (20%) até #dc2626 (39%)
  const ratio = Math.max(0, (integrity - 20) / 19) // 0 a 1
  const r = Math.round(252 + (220 - 252) * ratio)
  const g = Math.round(165 + (38 - 165) * ratio)
  const b = Math.round(165 + (38 - 165) * ratio)
  return `rgb(${r}, ${g}, ${b})`
}

// Retorna cor do círculo de integridade baseado na integridade
export function getIntegrityCircleColor(integrity: number): number {
  if (integrity >= 70) return 0x22c55e // verde - bom
  if (integrity >= 40) return 0xf59e0b // amarelo - alerta
  return 0xdc2626 // vermelho - crítico
}

export function getBlockStatus(integrity: number): string {
  if (integrity >= 70) return "Bom"
  if (integrity >= 40) return "Alerta"
  return "Crítico"
}

// Mock de obras
export const mockObras: Obra[] = [
  {
    id: "1",
    name: "Galpão Industrial Norte",
    integrity: 85,
    location: "Palmas - TO",
    status: "active",
    lastUpdate: "2025-01-20",
    area: 2500,
    year: 2023,
    type: "Galpão Industrial",
    responsavel: "Carlos Mendes",
    totalBlocos: 100,
  },
  {
    id: "2",
    name: "Centro de Distribuição Sul",
    integrity: 62,
    location: "Araguaína - TO",
    status: "warning",
    lastUpdate: "2025-01-19",
    area: 3200,
    year: 2022,
    type: "Centro de Distribuição",
    responsavel: "Ana Paula Silva",
    totalBlocos: 100,
  },
  {
    id: "3",
    name: "Fábrica de Reciclagem Oeste",
    integrity: 35,
    location: "Gurupi - TO",
    status: "critical",
    lastUpdate: "2025-01-18",
    area: 1800,
    year: 2021,
    type: "Fábrica",
    responsavel: "Roberto Costa",
    totalBlocos: 100,
  },
  {
    id: "4",
    name: "Armazém Logístico Central",
    integrity: 78,
    location: "Porto Nacional - TO",
    status: "active",
    lastUpdate: "2025-01-21",
    area: 2100,
    year: 2024,
    type: "Armazém",
    responsavel: "Marina Oliveira",
    totalBlocos: 100,
  },
  {
    id: "5",
    name: "Complexo Industrial Leste",
    integrity: 91,
    location: "Colinas do Tocantins - TO",
    status: "active",
    lastUpdate: "2025-01-22",
    area: 4500,
    year: 2024,
    type: "Complexo Industrial",
    responsavel: "Fernando Santos",
    totalBlocos: 100,
  },
]

// Cache de grids por obra
const blockGridCache: { [key: string]: Block[] } = {}
const integrityHistoryCache: { [key: string]: IntegrityHistoryPoint[] } = {}

export function getBlocksForObra(obraId: string): Block[] {
  if (!blockGridCache[obraId]) {
    blockGridCache[obraId] = generateBlockGrid(10)
  }
  return blockGridCache[obraId]
}

// Gera histórico de integridade para os últimos 30 dias
export function generateIntegrityHistory(currentIntegrity: number, seed: string = '0'): IntegrityHistoryPoint[] {
  const history: IntegrityHistoryPoint[] = []
  // Usar uma data fixa para evitar diferenças entre servidor e cliente
  const baseDate = new Date('2025-01-22')
  
  // Criar um gerador de números pseudo-aleatórios baseado em seed para consistência
  let seedValue = 0
  for (let i = 0; i < seed.length; i++) {
    seedValue += seed.charCodeAt(i)
  }
  
  const seededRandom = (index: number) => {
    const x = Math.sin(seedValue + index) * 10000
    return x - Math.floor(x)
  }
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)
    
    // Adiciona variação pseudo-aleatória mas mantém tendência
    const variation = (seededRandom(i) - 0.5) * 10
    const integrity = Math.max(0, Math.min(100, currentIntegrity + variation - (i * 0.2)))
    
    history.push({
      date: date.toISOString().split('T')[0],
      integrity: Math.round(integrity)
    })
  }
  
  return history
}

// Mock de notificações
export const mockNotifications: Notification[] = [
  {
    id: "1",
    obraId: "3",
    obraName: "Fábrica de Reciclagem Oeste",
    type: "critical",
    title: "Integridade Crítica Detectada",
    message: "A integridade caiu para 35%. Manutenção urgente necessária.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "2",
    obraId: "2",
    obraName: "Centro de Distribuição Sul",
    type: "warning",
    title: "Alerta de Manutenção Preventiva",
    message: "15 blocos com integridade entre 40-50%. Recomenda-se inspeção.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "3",
    obraId: "1",
    obraName: "Galpão Industrial Norte",
    type: "info",
    title: "Relatório Mensal Disponível",
    message: "O relatório de integridade de janeiro está pronto para download.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "4",
    obraId: "3",
    obraName: "Fábrica de Reciclagem Oeste",
    type: "critical",
    title: "Blocos Críticos Identificados",
    message: "32 blocos com integridade abaixo de 40% detectados no setor A.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: "5",
    obraId: "4",
    obraName: "Armazém Logístico Central",
    type: "info",
    title: "Manutenção Programada Concluída",
    message: "A manutenção preventiva foi concluída com sucesso.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: "6",
    obraId: "2",
    obraName: "Centro de Distribuição Sul",
    type: "warning",
    title: "Tendência de Queda Detectada",
    message: "A integridade média caiu 5% nas últimas 2 semanas.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  }
]

// Mock de eventos
export const mockEvents: Event[] = [
  {
    id: "1",
    obraId: "1",
    type: "inspection",
    description: "Inspeção de rotina realizada - Nenhum problema detectado",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user: "João Silva"
  },
  {
    id: "2",
    obraId: "3",
    type: "alert",
    description: "Alerta crítico - Integridade abaixo do limite",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    obraId: "2",
    type: "maintenance",
    description: "Manutenção preventiva agendada para 25/01/2025",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: "Carlos Mendes"
  },
  {
    id: "4",
    obraId: "4",
    type: "repair",
    description: "Substituição de 8 blocos danificados concluída",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: "Marina Oliveira"
  },
  {
    id: "5",
    obraId: "5",
    type: "inspection",
    description: "Inspeção trimestral realizada - Excelente condição",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user: "Fernando Santos"
  }
]

export function getIntegrityHistoryForObra(obraId: string): IntegrityHistoryPoint[] {
  if (!integrityHistoryCache[obraId]) {
    const obra = mockObras.find(o => o.id === obraId)
    if (!obra) return []
    integrityHistoryCache[obraId] = generateIntegrityHistory(obra.integrity, obraId)
  }
  return integrityHistoryCache[obraId]
}

export function getNotificationsForObra(obraId: string): Notification[] {
  return mockNotifications.filter(n => n.obraId === obraId)
}

export function getEventsForObra(obraId: string): Event[] {
  return mockEvents.filter(e => e.obraId === obraId)
}

export function getUnreadNotificationsCount(): number {
  return mockNotifications.filter(n => !n.read).length
}

// Mock de insights de IA por obra
const aiInsightsCache: { [key: string]: AIInsight[] } = {}

export function getAIInsightsForObra(obraId: string): AIInsight[] {
  if (!aiInsightsCache[obraId]) {
    const blocks = getBlocksForObra(obraId)
    
    // Encontrar blocos com problemas para gerar insights
    const criticalBlocks = blocks.filter(b => b.integrity < 40)
    const warningBlocks = blocks.filter(b => b.integrity >= 40 && b.integrity < 70)
    
    const insights: AIInsight[] = []
    
    // Insight 1: Bloco crítico com desgaste acelerado
    if (criticalBlocks.length > 0) {
      const block = criticalBlocks[0]
      insights.push({
        id: `${obraId}-insight-1`,
        blockPosition: { x: block.x, y: block.y },
        title: "Desgaste Acelerado Detectado",
        description: "Este bloco apresenta velocidade de desgaste 30% acima do normal nos últimos 7 dias.",
        severity: "critical",
        metrics: [
          { label: "Integridade Atual", value: `${block.integrity}%` },
          { label: "Velocidade de Desgaste", value: "+30%" },
          { label: "Tempo Estimado", value: "15 dias" }
        ]
      })
    }
    
    // Insight 2: Área com uso excessivo
    if (warningBlocks.length > 0) {
      const block = warningBlocks[Math.floor(warningBlocks.length / 2)]
      insights.push({
        id: `${obraId}-insight-2`,
        blockPosition: { x: block.x, y: block.y },
        title: "Uso Excessivo nos Últimos 3 Dias",
        description: "Tráfego intenso detectado nesta área. Recomenda-se redistribuição de carga.",
        severity: "warning",
        metrics: [
          { label: "Integridade Atual", value: `${block.integrity}%` },
          { label: "Pico de Tráfego", value: "2.3x normal" },
          { label: "Dias Consecutivos", value: "3 dias" }
        ]
      })
    }
    
    // Insight 3: Manutenção preventiva recomendada
    const middleBlock = blocks.find(b => b.x === 5 && b.y === 5) || blocks[blocks.length - 1]
    insights.push({
      id: `${obraId}-insight-3`,
      blockPosition: { x: middleBlock.x, y: middleBlock.y },
      title: "Manutenção Preventiva Recomendada",
      description: "Setor apresenta padrão de desgaste irregular. Inspeção detalhada recomendada.",
      severity: middleBlock.integrity < 50 ? "critical" : "info",
      metrics: [
        { label: "Integridade Média", value: `${middleBlock.integrity}%` },
        { label: "Blocos Afetados", value: "8 blocos" },
        { label: "Prioridade", value: "Média" }
      ]
    })
    
    aiInsightsCache[obraId] = insights
  }
  
  return aiInsightsCache[obraId]
}
