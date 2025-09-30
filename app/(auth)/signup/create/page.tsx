import React from "react";
import { SignupForm } from "@/components/auth/signup-form";
import { GalleryVerticalEnd } from "lucide-react";

const SignInForm = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:flex lg:flex-col justify-center items-start pl-2">
        <h1 className="scroll-m-20 text-justify text-8xl font-primary font-black tracking-tight text-balance text-primary">
          Welcome to <br /> Rhythmé
        </h1>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-primary">
          Your rhythm of focus, growth, and balance starts here.
        </h2>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tighter">
                    One account, a simpler path to productivity
        </h3>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Rhythmé Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
