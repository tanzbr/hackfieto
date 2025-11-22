import { Notification } from "./mock-data"

export function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "agora mesmo"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`
}

export function getNotificationIcon(type: Notification["type"]): string {
  switch (type) {
    case "critical":
      return "🔴"
    case "warning":
      return "⚠️"
    case "info":
      return "ℹ️"
    default:
      return "📢"
  }
}

export function getNotificationColor(type: Notification["type"]): {
  bg: string
  text: string
  border: string
} {
  switch (type) {
    case "critical":
      return {
        bg: "bg-red-50",
        text: "text-red-900",
        border: "border-red-200"
      }
    case "warning":
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-900",
        border: "border-yellow-200"
      }
    case "info":
      return {
        bg: "bg-blue-50",
        text: "text-blue-900",
        border: "border-blue-200"
      }
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-900",
        border: "border-gray-200"
      }
  }
}

