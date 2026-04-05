"use client";
import React from "react";
import Image from "next/image";
import { SignupForm } from "@/components/auth/signup-form";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupCreatePage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-background">
      {/* Left side - Hero section (Desktop) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute z-10 bg-accent t-0 hidden lg:flex lg:left-5 lg:top-0 justify-center items-start pl-8 p-6 w-[50%] h-full rounded-r-full"
      ></motion.div>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="z-10 bg-primary relative hidden lg:flex lg:flex-col justify-center items-start pl-8 p-6 rounded-r-full"
      >
        <h1 className="scroll-m-20 text-justify text-8xl font-primary font-black tracking-tight text-balance text-primary-foreground">
          Join <br /> Rhythmé
        </h1>
        <h2 className="scroll-m-20 border-b border-primary-foreground/20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-primary text-primary-foreground/90">
          Unify tasks, habits, and emotional awareness
        </h2>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tighter text-primary-foreground/80">
          Execute consistently — without overwhelm
        </h3>
      </motion.div>

      {/* Right side - Signup form */}
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-background">
        {/* Header with Logo */}
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium text-foreground group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-md group-hover:bg-primary/30 transition-all duration-300"></div>
              <div className="relative bg-background border border-primary/30 flex size-8 items-center justify-center rounded-md group-hover:border-primary/50 transition-all duration-300">
                <Image
                  src="/Rhythme.svg"
                  alt="Rhythmé logo"
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <span className="font-primary font-bold">Rhythmé</span>
          </Link>
        </div>

        {/* Mobile Hero */}
        <div className="lg:hidden text-center py-4">
          <h1 className="text-2xl sm:text-3xl font-primary font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Join Rhythmé
          </h1>
          <p className="text-sm text-muted-foreground">
            Start your productivity journey
          </p>
        </div>

        {/* Signup Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
