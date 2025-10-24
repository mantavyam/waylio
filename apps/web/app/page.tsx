import { Button } from "@workspace/ui/components/button"

import { AppSidebar } from "@workspace/ui/components/app-sidebar"
import { ChartAreaInteractive } from "@workspace/ui/components/chart-area-interactive"
import { DataTable } from "@workspace/ui/components/data-table"
import { SectionCards } from "@workspace/ui/components/section-cards"
import { SiteHeader } from "@workspace/ui/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar"

import data from "@workspace/ui/app/dashboard/data.json"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <SectionCards />
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}