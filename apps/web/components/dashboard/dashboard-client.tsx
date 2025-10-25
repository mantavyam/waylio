"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@workspace/ui/components/app-sidebar"
import { ChartAreaInteractive } from "@workspace/ui/components/chart-area-interactive"
import { DataTable } from "@workspace/ui/components/data-table"
import { SectionCards } from "@workspace/ui/components/section-cards"
import { SiteHeader } from "@workspace/ui/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import data from "@workspace/ui/app/dashboard/data.json"

interface DashboardClientProps {
  user: {
    name: string
    email: string
    id: string
  }
}

export function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter()
  const [activeView, setActiveView] = useState("Dashboard")

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  const handleNavigate = (url: string, title: string) => {
    setActiveView(title)
  }

  const renderContent = () => {
    switch (activeView) {
      case "Dashboard":
        return (
          <>
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <SectionCards />
            <DataTable data={data} />
          </>
        )
      case "Lifecycle":
        return (
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Lifecycle Management</h2>
              <p className="text-muted-foreground">This feature is coming soon.</p>
            </div>
          </div>
        )
      case "Analytics":
        return (
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
              <p className="text-muted-foreground">This feature is coming soon.</p>
            </div>
          </div>
        )
      case "Projects":
        return (
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Projects</h2>
              <p className="text-muted-foreground">This feature is coming soon.</p>
            </div>
          </div>
        )
      case "Team":
        return (
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Team Management</h2>
              <p className="text-muted-foreground">This feature is coming soon.</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">{activeView}</h2>
              <p className="text-muted-foreground">This feature is coming soon.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar 
        variant="inset" 
        user={user} 
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
