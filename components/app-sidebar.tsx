"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Building2,
  BarChart3,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"

const menuItems = {
  principal: [
    {
      title: "Visão Geral",
      url: "/obras",
      hash: "",
      icon: LayoutGrid,
    },
    {
      title: "Minhas Obras",
      url: "/obras",
      hash: "#obras-recentes",
      icon: Building2,
    },
    {
      title: "Relatórios",
      url: "#",
      hash: "",
      icon: BarChart3,
    },
  ],

  sistema: [
    {
      title: "Configurações",
      url: "#",
      hash: "",
      icon: Settings,
    },
  ],
}

export function AppSidebar() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    // Atualizar seção ativa baseado no hash da URL
    const updateActiveSection = () => {
      setActiveSection(window.location.hash)
    }

    updateActiveSection()
    window.addEventListener("hashchange", updateActiveSection)
    
    return () => {
      window.removeEventListener("hashchange", updateActiveSection)
    }
  }, [])

  const handleMenuClick = (e: React.MouseEvent, item: typeof menuItems.principal[0]) => {
    if (item.hash && item.url !== "#") {
      e.preventDefault()
      
      // Atualizar URL com hash
      window.history.pushState(null, "", item.url + item.hash)
      setActiveSection(item.hash)
      
      // Scroll suave para a seção
      const elementId = item.hash.replace("#", "")
      const element = document.getElementById(elementId)
      
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } else if (!item.hash && item.url === "/obras") {
      // Se for visão geral, scroll para o topo
      e.preventDefault()
      window.history.pushState(null, "", item.url)
      setActiveSection("")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="border-b border-white/10 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold text-xl border border-slate-700">
            N
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-white tracking-tight">Nexfloor</span>
            <span className="text-xs text-slate-500 font-normal">Sistema de Monitoramento</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Seção Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 py-2 mb-1">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.principal.map((item) => {
                const isActive = pathname === item.url && item.url !== "#" && activeSection === item.hash
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isActive 
                          ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-900/20 font-semibold border border-slate-600" 
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <Link 
                        href={item.url + item.hash} 
                        className="flex items-center gap-3"
                        onClick={(e) => handleMenuClick(e, item)}
                      >
                        <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>




      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-3">
        {/* Seção Sistema */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.sistema.map((item) => {
                const isActive = pathname === item.url && item.url !== "#" && activeSection === item.hash
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isActive 
                          ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-900/20 font-semibold border border-slate-600" 
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <Link 
                        href={item.url + item.hash} 
                        className="flex items-center gap-3"
                        onClick={(e) => handleMenuClick(e, item)}
                      >
                        <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarFooter>
    </Sidebar>
  )
}

