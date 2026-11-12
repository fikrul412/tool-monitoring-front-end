
"use client";

import { AuthHeader } from "./auth-header";
import { RegisterForm } from "./register-form";

export function RegisterPage() {


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto max-w-5xl px-6 py-4">
          <AuthHeader />
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
