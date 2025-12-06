import { SiteHeader } from '@/components/site-header'
import { Habits } from '@/sections/Habits'
import React from 'react'

const HabitsPage = () => {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-10">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Habits />
          </div>
        </div>
      </div>
    </>
  )
}

export default HabitsPage