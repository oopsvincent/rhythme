"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SignupFlow() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => s + 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="absolute w-full"
            >
              <h1 className="text-xl font-bold text-center">
                Welcome to <span className="text-orange-500">Rhythmé</span>
              </h1>
              <p className="mt-4 text-sm text-center text-gray-600">
                Your personal growth space starts here.
              </p>
              <Button
                className="w-full mt-8 py-6 bg-orange-500 hover:bg-orange-600 rounded-full"
                onClick={next}
              >
                Continue →
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="absolute w-full"
            >
              <h2 className="text-lg font-semibold mb-4">Create your account</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border rounded-lg p-3"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded-lg p-3"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border rounded-lg p-3"
                />
                <Button
                  className="w-full py-6 bg-orange-500 hover:bg-orange-600 rounded-full"
                  type="submit"
                >
                  Sign Up
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
