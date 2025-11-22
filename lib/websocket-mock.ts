import { Notification } from "./mock-data"

type NotificationCallback = (notification: Notification) => void

class WebSocketMock {
  private listeners: NotificationCallback[] = []
  private interval: NodeJS.Timeout | null = null
  private isConnected: boolean = false

  connect() {
    // Previne múltiplas conexões
    if (this.isConnected) {
      console.log("[WebSocket Mock] Já conectado, ignorando nova conexão")
      return
    }

    // Simula conexão WebSocket
    console.log("[WebSocket Mock] Conectado")
    this.isConnected = true

    // Simula recebimento de notificações aleatórias
    this.interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de chance de nova notificação
        this.simulateNotification()
      }
    }, 30000) // A cada 30 segundos
  }

  disconnect() {
    console.log("[WebSocket Mock] Desconectado")
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.isConnected = false
  }

  onNotification(callback: NotificationCallback): () => void {
    // Adiciona listener
    this.listeners.push(callback)
    
    // Retorna função de cleanup para remover o listener
    return () => {
      this.removeListener(callback)
    }
  }

  private removeListener(callback: NotificationCallback) {
    const index = this.listeners.indexOf(callback)
    if (index > -1) {
      this.listeners.splice(index, 1)
      console.log("[WebSocket Mock] Listener removido, total:", this.listeners.length)
    }
  }

  // Método público para limpar todos os listeners
  clearAllListeners() {
    this.listeners = []
    console.log("[WebSocket Mock] Todos os listeners removidos")
  }

  private simulateNotification() {
    const types: Notification["type"][] = ["critical", "warning", "info"]
    const obraIds = ["1", "2", "3", "4", "5"]
    const obraNames = [
      "Galpão Industrial Norte",
      "Centro de Distribuição Sul",
      "Fábrica de Reciclagem Oeste",
      "Armazém Logístico Central",
      "Complexo Industrial Leste"
    ]

    const messages = {
      critical: [
        "Integridade crítica detectada em múltiplos blocos",
        "Sistema de alerta crítico ativado",
        "Necessária intervenção imediata"
      ],
      warning: [
        "Tendência de queda na integridade detectada",
        "Manutenção preventiva recomendada",
        "Blocos com baixa integridade identificados"
      ],
      info: [
        "Relatório de integridade disponível",
        "Manutenção programada concluída",
        "Inspeção de rotina realizada"
      ]
    }

    const type = types[Math.floor(Math.random() * types.length)]
    const obraIndex = Math.floor(Math.random() * obraIds.length)

    const notification: Notification = {
      id: `sim-${Date.now()}`,
      obraId: obraIds[obraIndex],
      obraName: obraNames[obraIndex],
      type,
      title: type === "critical" ? "Alerta Crítico" : type === "warning" ? "Aviso" : "Informação",
      message: messages[type][Math.floor(Math.random() * messages[type].length)],
      timestamp: new Date().toISOString(),
      read: false
    }

    this.listeners.forEach(listener => listener(notification))
  }

  // Método para simular notificação manual (para testes)
  sendNotification(notification: Notification) {
    this.listeners.forEach(listener => listener(notification))
  }
}

export const websocketMock = new WebSocketMock()

