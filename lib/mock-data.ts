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

// Gera uma grade de blocos com integridades aleatórias
export function generateBlockGrid(size = 20): Block[] {
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

// Retorna cor baseada na integridade
export function getBlockColor(integrity: number): string {
  if (integrity >= 70) return "#ffffff" // branco - bom
  if (integrity >= 40) return "#fbbf24" // amarelo - alerta
  return "#ef4444" // vermelho - crítico
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
    totalBlocos: 400,
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
    totalBlocos: 400,
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
    totalBlocos: 400,
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
    totalBlocos: 400,
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
    totalBlocos: 400,
  },
]

// Cache de grids por obra
const blockGridCache: { [key: string]: Block[] } = {}

export function getBlocksForObra(obraId: string): Block[] {
  if (!blockGridCache[obraId]) {
    blockGridCache[obraId] = generateBlockGrid(20)
  }
  return blockGridCache[obraId]
}

// Gera histórico de integridade para os últimos 30 dias
export function generateIntegrityHistory(currentIntegrity: number): IntegrityHistoryPoint[] {
  const history: IntegrityHistoryPoint[] = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Adiciona variação aleatória mas mantém tendência
    const variation = (Math.random() - 0.5) * 10
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
  const obra = mockObras.find(o => o.id === obraId)
  if (!obra) return []
  return generateIntegrityHistory(obra.integrity)
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
