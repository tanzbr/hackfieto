export interface Obra {
  id: string
  name: string
  integrity: number // 0-100
  location: string
  status: "active" | "warning" | "critical"
  lastUpdate: string
}

export interface Block {
  x: number
  y: number
  integrity: number // 0-100
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
  },
  {
    id: "2",
    name: "Centro de Distribuição Sul",
    integrity: 62,
    location: "Araguaína - TO",
    status: "warning",
    lastUpdate: "2025-01-19",
  },
  {
    id: "3",
    name: "Fábrica de Reciclagem Oeste",
    integrity: 35,
    location: "Gurupi - TO",
    status: "critical",
    lastUpdate: "2025-01-18",
  },
  {
    id: "4",
    name: "Armazém Logístico Central",
    integrity: 78,
    location: "Porto Nacional - TO",
    status: "active",
    lastUpdate: "2025-01-21",
  },
  {
    id: "5",
    name: "Complexo Industrial Leste",
    integrity: 91,
    location: "Colinas do Tocantins - TO",
    status: "active",
    lastUpdate: "2025-01-22",
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
