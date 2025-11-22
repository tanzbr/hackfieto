import * as XLSX from 'xlsx'
import { Obra, Block, IntegrityHistoryPoint } from '../mock-data'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function generateObraExcelReport(
  obra: Obra,
  blocks: Block[],
  history: IntegrityHistoryPoint[]
) {
  const workbook = XLSX.utils.book_new()
  
  // Aba 1: Resumo da Obra
  const resumoData = [
    ['RELATÓRIO DE INTEGRIDADE - NEXFLOOR'],
    [''],
    ['Informações da Obra'],
    ['ID', obra.id],
    ['Nome', obra.name],
    ['Localização', obra.location],
    ['Integridade Atual', `${obra.integrity}%`],
    ['Status', obra.status === 'active' ? 'Ativo' : obra.status === 'warning' ? 'Atenção' : 'Crítico'],
    ['Última Atualização', format(new Date(obra.lastUpdate), 'dd/MM/yyyy', { locale: ptBR })],
    ...(obra.area ? [['Área', `${obra.area} m²`]] : []),
    ...(obra.year ? [['Ano de Instalação', obra.year]] : []),
    ...(obra.responsavel ? [['Responsável', obra.responsavel]] : []),
    ...(obra.totalBlocos ? [['Total de Blocos', obra.totalBlocos]] : []),
    [''],
    ['Estatísticas dos Blocos'],
    ['Status', 'Quantidade', 'Percentual'],
    [
      'Bom (≥70%)',
      blocks.filter(b => b.integrity >= 70).length,
      `${((blocks.filter(b => b.integrity >= 70).length / blocks.length) * 100).toFixed(1)}%`
    ],
    [
      'Alerta (40-69%)',
      blocks.filter(b => b.integrity >= 40 && b.integrity < 70).length,
      `${((blocks.filter(b => b.integrity >= 40 && b.integrity < 70).length / blocks.length) * 100).toFixed(1)}%`
    ],
    [
      'Crítico (<40%)',
      blocks.filter(b => b.integrity < 40).length,
      `${((blocks.filter(b => b.integrity < 40).length / blocks.length) * 100).toFixed(1)}%`
    ],
    ['Total', blocks.length, '100%'],
    [''],
    ['Gerado em', format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })]
  ]
  
  const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData)
  
  // Ajusta largura das colunas
  resumoSheet['!cols'] = [
    { wch: 25 },
    { wch: 40 },
    { wch: 15 }
  ]
  
  XLSX.utils.book_append_sheet(workbook, resumoSheet, 'Resumo')
  
  // Aba 2: Histórico de Integridade
  const historicoData = [
    ['Histórico de Integridade'],
    [''],
    ['Data', 'Integridade (%)', 'Variação']
  ]
  
  history.forEach((point, index) => {
    const prevIntegrity = index > 0 ? history[index - 1].integrity : point.integrity
    const variation = point.integrity - prevIntegrity
    const variationText = variation === 0 ? '--' : variation > 0 ? `+${variation}` : `${variation}`
    
    historicoData.push([
      format(new Date(point.date), 'dd/MM/yyyy', { locale: ptBR }),
      point.integrity,
      variationText
    ])
  })
  
  const historicoSheet = XLSX.utils.aoa_to_sheet(historicoData)
  historicoSheet['!cols'] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 15 }
  ]
  
  XLSX.utils.book_append_sheet(workbook, historicoSheet, 'Histórico')
  
  // Aba 3: Detalhes dos Blocos
  const blocosData = [
    ['Detalhes dos Blocos'],
    [''],
    ['Posição X', 'Posição Y', 'Integridade (%)', 'Status']
  ]
  
  blocks.forEach(block => {
    const status = block.integrity >= 70 ? 'Bom' : block.integrity >= 40 ? 'Alerta' : 'Crítico'
    blocosData.push([
      block.x,
      block.y,
      block.integrity,
      status
    ])
  })
  
  const blocosSheet = XLSX.utils.aoa_to_sheet(blocosData)
  blocosSheet['!cols'] = [
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
    { wch: 12 }
  ]
  
  XLSX.utils.book_append_sheet(workbook, blocosSheet, 'Blocos')
  
  return workbook
}

export function downloadObraExcel(
  obra: Obra,
  blocks: Block[],
  history: IntegrityHistoryPoint[]
) {
  const workbook = generateObraExcelReport(obra, blocks, history)
  const fileName = `relatorio-${obra.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

export function generateObrasComparisonExcel(obras: Obra[]) {
  const workbook = XLSX.utils.book_new()
  
  // Aba de comparação
  const comparisonData = [
    ['COMPARAÇÃO DE OBRAS - NEXFLOOR'],
    [''],
    ['Nome', 'Localização', 'Integridade (%)', 'Status', 'Última Atualização', 'Área (m²)', 'Responsável']
  ]
  
  obras.forEach(obra => {
    comparisonData.push([
      obra.name,
      obra.location,
      obra.integrity,
      obra.status === 'active' ? 'Ativo' : obra.status === 'warning' ? 'Atenção' : 'Crítico',
      format(new Date(obra.lastUpdate), 'dd/MM/yyyy', { locale: ptBR }),
      obra.area || '--',
      obra.responsavel || '--'
    ])
  })
  
  comparisonData.push(
    [''],
    ['Gerado em', format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })]
  )
  
  const comparisonSheet = XLSX.utils.aoa_to_sheet(comparisonData)
  comparisonSheet['!cols'] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 18 },
    { wch: 12 },
    { wch: 20 },
    { wch: 12 },
    { wch: 25 }
  ]
  
  XLSX.utils.book_append_sheet(workbook, comparisonSheet, 'Comparação')
  
  const fileName = `comparacao-obras-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

