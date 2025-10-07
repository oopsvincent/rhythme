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
                <form action={ async () => {
                    "use server";

                    redirect("/dashboard")
                }}>
                  {/* Add form fields or content here if needed */}
                  <Button type="submit">Dashboard</Button>
                </form>
              </> : 
              <>
                <form action={ async () => {
                    "use server";

                    redirect("/login")
                }}>
                  {/* Add form fields or content here if needed */}
                  <Button variant="ghost" type="submit">Login</Button>
                </form>
                <form action={ async () => {
                    "use server";

                    redirect("/signup/intro")
                }}>
                  {/* Add form fields or content here if needed */}
                  <Button type="submit">Get Started</Button>
                </form>
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
