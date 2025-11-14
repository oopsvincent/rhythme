// app/dashboard/page.tsx

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import data from "./data.json"
import { Goals } from "@/sections/Goals"
import { Habits } from "@/sections/Habits"
import { Tasks } from "@/sections/Tasks"
import { getUser } from "../actions/auth"
import { getGreeting } from "@/utils/getGreetings"
import { Separator } from "@/components/ui/separator"

export default async function Page() {

    const user =  await getUser();
    const greetings = getGreeting();


  return (
    <>    
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <main className="flex justify-start items-center flex-wrap mx-6">
                <h1 className="text-4xl font-extrabold font-primary">{greetings}, {user?.name.split(" ")[0]}</h1>
            </main>

            <Separator />
            
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>

              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
                {/* Add more analytics-specific components */}
              </div>

              <DataTable data={data} />           

          </div>
        </div>
      </div>
    </>
  )
}