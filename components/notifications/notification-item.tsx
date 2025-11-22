"use client"

import { Notification } from "@/lib/mock-data"
import { formatTimeAgo, getNotificationColor } from "@/lib/notifications"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const colors = getNotificationColor(notification.type)

  return (
    <div
      className={cn(
        "p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
        !notification.read && "bg-blue-50/30"
      )}
    >
      <div className="flex gap-3">
        <div className={cn(
          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
          notification.type === "critical" && "bg-red-500",
          notification.type === "warning" && "bg-yellow-500",
          notification.type === "info" && "bg-blue-500"
        )} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Link 
                href={`/obras/${notification.obraId}`}
                className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {notification.title}
              </Link>
              <p className="text-xs text-gray-500 mt-0.5">
                {notification.obraName}
              </p>
            </div>
            {!notification.read && onMarkAsRead && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Marcar como lida
              </button>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            {notification.message}
          </p>
          
          <p className="text-xs text-gray-400 mt-2">
            {formatTimeAgo(notification.timestamp)}
          </p>
        </div>
      </div>
    </div>
  )
}

