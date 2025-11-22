import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Obra, Block, IntegrityHistoryPoint } from '../mock-data'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function generateObraPDFReport(
  obra: Obra,
  blocks: Block[],
  history: IntegrityHistoryPoint[]
) {
  const doc = new jsPDF()
  
  // Cabeçalho
  doc.setFontSize(20)
  doc.setTextColor(17, 24, 39)
  doc.text('Nexfloor', 14, 20)
  
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text('Sistema de Monitoramento de Integridade', 14, 27)
  
  // Data do relatório
  doc.setFontSize(9)
  doc.text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}`, 14, 34)
  
  // Linha separadora
  doc.setDrawColor(229, 231, 235)
  doc.line(14, 38, 196, 38)
  
  // Título do relatório
  doc.setFontSize(16)
  doc.setTextColor(17, 24, 39)
  doc.text(`Relatório da Obra: ${obra.name}`, 14, 48)
  
  // Informações da obra
  let yPos = 58
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Informações Gerais', 14, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const infoData = [
    ['ID da Obra', obra.id],
    ['Localização', obra.location],
    ['Integridade Atual', `${obra.integrity}%`],
    ['Status', obra.status === 'active' ? 'Ativo' : obra.status === 'warning' ? 'Atenção' : 'Crítico'],
    ['Última Atualização', format(new Date(obra.lastUpdate), 'dd/MM/yyyy', { locale: ptBR })],
    ...(obra.area ? [['Área', `${obra.area} m²`]] : []),
    ...(obra.year ? [['Ano de Instalação', obra.year.toString()]] : []),
    ...(obra.responsavel ? [['Responsável', obra.responsavel]] : []),
    ...(obra.totalBlocos ? [['Total de Blocos', obra.totalBlocos.toString()]] : []),
  ]
  
  autoTable(doc, {
    startY: yPos,
    head: [],
    body: infoData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 100 }
    }
  })
  
  // Estatísticas dos blocos
  yPos = (doc as any).lastAutoTable.finalY + 15
  
  const bomCount = blocks.filter(b => b.integrity >= 70).length
  const alertaCount = blocks.filter(b => b.integrity >= 40 && b.integrity < 70).length
  const criticoCount = blocks.filter(b => b.integrity < 40).length
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Estatísticas dos Blocos', 14, yPos)
  
  yPos += 10
  
  autoTable(doc, {
    startY: yPos,
    head: [['Status', 'Quantidade', 'Percentual']],
    body: [
      ['Bom (≥70%)', bomCount.toString(), `${((bomCount / blocks.length) * 100).toFixed(1)}%`],
      ['Alerta (40-69%)', alertaCount.toString(), `${((alertaCount / blocks.length) * 100).toFixed(1)}%`],
      ['Crítico (<40%)', criticoCount.toString(), `${((criticoCount / blocks.length) * 100).toFixed(1)}%`],
      ['Total', blocks.length.toString(), '100%']
    ],
    theme: 'striped',
    headStyles: { fillColor: [17, 24, 39] },
    styles: { fontSize: 9 }
  })
  
  // Histórico de integridade (últimos 10 registros)
  yPos = (doc as any).lastAutoTable.finalY + 15
  
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Histórico de Integridade (Últimos 10 Dias)', 14, yPos)
  
  yPos += 10
  
  const recentHistory = history.slice(-10).reverse()
  
  autoTable(doc, {
    startY: yPos,
    head: [['Data', 'Integridade', 'Variação']],
    body: recentHistory.map((point, index) => {
      const prevIntegrity = index < recentHistory.length - 1 ? recentHistory[index + 1].integrity : point.integrity
      const variation = point.integrity - prevIntegrity
      const variationText = variation === 0 ? '--' : variation > 0 ? `+${variation}%` : `${variation}%`
      
      return [
        format(new Date(point.date), 'dd/MM/yyyy', { locale: ptBR }),
        `${point.integrity}%`,
        variationText
      ]
    }),
    theme: 'striped',
    headStyles: { fillColor: [17, 24, 39] },
    styles: { fontSize: 9 }
  })
  
  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(107, 114, 128)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
    doc.text(
      'Nexfloor - Desafio Industrial FIETO',
      14,
      doc.internal.pageSize.getHeight() - 10
    )
  }
  
  return doc
}

export function downloadObraPDF(
  obra: Obra,
  blocks: Block[],
  history: IntegrityHistoryPoint[]
) {
  const doc = generateObraPDFReport(obra, blocks, history)
  const fileName = `relatorio-${obra.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`
  doc.save(fileName)
}

