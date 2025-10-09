import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
// import { useRouter } from 'next/navigation';

const Navbar = async () => {
  // const router = useRouter();
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  console.log(user);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      {/* Navigation */}
      <header>
        <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold font-primary">Rhythmé</h1>
              <div className="hidden md:flex gap-6">
                {/* <button
                onClick={() => scrollToSection("features")}
                className="text-foreground hover:text-primary transition"
              >
                Explore
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-foreground hover:text-primary transition"
              >
                Pricing
              </button> */}
              </div>
            </div>
            <div className="flex gap-4">
              {user && user.id ? 
              <>
            <Link className="justify-center items-center bg-primary rounded-md p-2" href={"/dashboard"}>Dashboard</Link>
              </> : 
              <>
                <Link href={"/login"} className="bg-primary/5 hover:bg-primary/50 justify-center items-center rounded-md px-2 py-1.5 transition-all duration-300">Login</Link>
                <Link href={"/signup/intro"} className="bg-primary justify-center items-center rounded-md px-2 py-1.5">Get Started for Free</Link>
              </>}
              {/* <Button variant="ghost" onClick={() => router.push("/login")}>Log in</Button> */}
              {/* <Link className="bg-primary rounded-md flex justify-center items-center p-2" href={"/signup/intro"}>Get started</Link> */}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
