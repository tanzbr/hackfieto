"use client"

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: "card" | "text" | "circle" | "button"
}

export function LoadingSkeleton({ className, variant = "card" }: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 rounded"
  
  const variantClasses = {
    card: "w-full h-48",
    text: "w-full h-4",
    circle: "w-12 h-12 rounded-full",
    button: "w-32 h-10"
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <LoadingSkeleton className="w-48 h-8" />
        <LoadingSkeleton className="w-64 h-4" />
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <LoadingSkeleton key={i} className="h-24" />
        ))}
      </div>

      {/* Lista de obras */}
      <LoadingSkeleton className="h-96" />
    </div>
  )
}

export function ObraDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <LoadingSkeleton className="h-32" />

      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-6">
        <LoadingSkeleton className="h-80" />
        <LoadingSkeleton className="h-80" />
      </div>

      {/* Visualização 3D */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <LoadingSkeleton className="h-[600px]" />
        </div>
        <div className="space-y-6">
          <LoadingSkeleton className="h-48" />
          <LoadingSkeleton className="h-48" />
        </div>
      </div>
    </div>
  )
}

