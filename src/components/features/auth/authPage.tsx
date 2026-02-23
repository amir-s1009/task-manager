"use client";

import { useState } from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Action } from "@/core/ports/action.port";
import { SignupSchema } from "@/schema/auth/auth.signup.schema";
import { LoginSchema } from "@/schema/auth/auth.login.schema";
import { LoginEntity } from "@/entities/auth/auth.login.entity";
import { SignupEntity } from "@/entities/auth/auth.signup.entity";
import SignupCard from "./signupCard";
import LoginCard from "./loginCard";

type AuthPageProps = {
  onLogin: Action<LoginSchema, LoginEntity>;
  onRegister: Action<SignupSchema, SignupEntity>;
};

export default function AuthPageClient({ onLogin, onRegister }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const easeOut = cubicBezier(0.22, 1, 0.36, 1);
  const slideVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: easeOut,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.25,
        ease: easeOut,
      },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl rounded-2xl border-muted/40 backdrop-blur-xl bg-background/80">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Task Manager
              </h1>
              <p className="text-muted-foreground text-sm">
                Organize your chaos. Dominate your day.
              </p>
            </div>

            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "login" | "register")}
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative min-h-[280px] overflow-hidden">
              <AnimatePresence
                mode="wait"
                custom={activeTab === "login" ? -1 : 1}
              >
                {activeTab === "login" ? (
                  <motion.div
                    key="login"
                    custom={-1}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <LoginCard onLogin={onLogin} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    custom={1}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <SignupCard onRegister={onRegister} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
