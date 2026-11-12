"use client";

import { AuthHeader } from "./auth-header";
import { LoginForm } from "./login-form";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto max-w-5xl px-6 py-4">
          <AuthHeader />
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}