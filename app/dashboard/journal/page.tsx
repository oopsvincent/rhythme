"use client";
import { SiteHeader } from "@/components/site-header";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const JournalPage = () => {
    const [open, setOpen] = React.useState(false);
      const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <div>
      <SiteHeader />
      <Drawer open={open} onOpenChange={setOpen} setBackgroundColorOnScale={true} scrollLockTimeout={5}>
        <DrawerTrigger className="bg-primary m-5 p-2 rounded-2xl" >Open Calendar</DrawerTrigger>
        <DrawerContent className="h-[70%]">
        <DrawerHeader>
            <DrawerTitle>Calendar</DrawerTitle>
            <DrawerDescription>Journal Calendar</DrawerDescription>
        </DrawerHeader>
            <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="w-full h-full"
      captionLayout="dropdown"
    />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default JournalPage;
