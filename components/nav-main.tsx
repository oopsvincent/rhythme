// // components/nav-main.tsx
// "use client"

// import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
// import { Button } from "@/components/ui/button"
// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import { useNavigationStore } from "@/store/nav-store"

// export function NavMain({
//   items,
// }: {
//   items: {
//     title: string
//     url: string
//     icon?: Icon
//     section: string // Add this prop
//   }[]
// }) {


//   return (
//     <SidebarGroup>
//       <SidebarGroupContent className="flex flex-col gap-2">
//         {/* Quick Create button stays the same */}
//         <SidebarMenu>
//           <SidebarMenuItem className="flex items-center gap-2">
//             <SidebarMenuButton
//               tooltip="Quick Create"
//               className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
//             >
//               <IconCirclePlusFilled />
//               <span>Quick Create</span>
//             </SidebarMenuButton>
//             <Button
//               size="icon"
//               className="size-8 group-data-[collapsible=icon]:opacity-0"
//               variant="outline"
//             >
//               <IconMail />
//               <span className="sr-only">Inbox</span>
//             </Button>
//           </SidebarMenuItem>
//         </SidebarMenu>
        
//         {/* Navigation items */}

//       </SidebarGroupContent>
//     </SidebarGroup>
//   )
// }
"use client"

import { type LucideIcon } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigationStore } from "@/store/nav-store"

// 👇 Import your Section type from where it's defined
import type { Section } from "@/store/nav-store"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    section: string
    isActive?: boolean
  }[]
}) {
  const { activeSection, setActiveSection } = useNavigationStore()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = activeSection === item.section

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => setActiveSection(item.section as Section)}
              isActive={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}