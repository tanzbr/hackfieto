"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { NotificationCenter } from "./notifications/notification-center"
import { getUnreadNotificationsCount } from "@/lib/mock-data"
import { websocketMock } from "@/lib/websocket-mock"
import toast from "react-hot-toast"

interface AppHeaderProps {
  title?: string
}

export function AppHeader({ title = "Visão Geral" }: AppHeaderProps = {}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(getUnreadNotificationsCount())

  useEffect(() => {
    // Atualiza o contador baseado nas notificações reais
    const updateCount = () => setUnreadCount(getUnreadNotificationsCount())
    
    // Conecta ao WebSocket mock
    websocketMock.connect()

    // Escuta novas notificações e guarda a função de cleanup
    const unsubscribe = websocketMock.onNotification((notification) => {
      updateCount()
      
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
  
  // Atualiza contador quando o painel de notificações é fechado
  useEffect(() => {
    if (!notificationsOpen) {
      setUnreadCount(getUnreadNotificationsCount())
    }
  }, [notificationsOpen])

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-semibold text-gray-900">
            {title}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Botão de notificações */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-red-500 rounded-full min-w-[20px]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">João Silva</div>
              <div className="text-xs text-gray-500">Engenheiro Civil</div>
            </div>
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-medium">
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

