"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { NotificationCenter } from "./notifications/notification-center"
import { getUnreadNotificationsCount } from "@/lib/mock-data"
import { websocketMock } from "@/lib/websocket-mock"
import toast from "react-hot-toast"

export function AppHeader() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(getUnreadNotificationsCount())

  useEffect(() => {
    // Conecta ao WebSocket mock
    websocketMock.connect()

    // Escuta novas notificações e guarda a função de cleanup
    const unsubscribe = websocketMock.onNotification((notification) => {
      setUnreadCount(prev => prev + 1)
      
      // Mostra toast para notificações críticas
      if (notification.type === "critical") {
        toast.error(
          <div>
            <strong>{notification.title}</strong>
            <p className="text-sm mt-1">{notification.message}</p>
          </div>,
          { duration: 7000, id: notification.id } // ID único para evitar duplicatas
        )
      } else if (notification.type === "warning") {
        toast(
          <div>
            <strong>{notification.title}</strong>
            <p className="text-sm mt-1">{notification.message}</p>
          </div>,
          { icon: "⚠️", duration: 5000, id: notification.id } // ID único para evitar duplicatas
        )
      }
    })

    return () => {
      // Remove apenas este listener específico
      unsubscribe()
      // Não desconectamos o WebSocket aqui para permitir múltiplos componentes
    }
  }, [])

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/obras" className="text-2xl font-bold text-gray-900">
            Nexfloor
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
            {/* Botão de notificações */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[20px]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

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

      {/* Centro de notificações */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </header>
  )
}

