
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserRoundPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authService } from "@/features/auth/services/auth.service";
import type { RegisterPayload } from "@/features/auth/interfaces/register.interface";

export function RegisterForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleAuthUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}/google`;

  async function handleSubmit(
    event: Parameters<
      NonNullable<React.ComponentProps<"form">["onSubmit"]>
    >[0]
  ) {
    event.preventDefault();

    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const payload: RegisterPayload = {
      name: String(formData.get("name")),
      nim: String(formData.get("nim")),
      studyProgram: String(formData.get("studyProgram") || ''),
      whatsapp: String(formData.get("whatsapp") || ''),
      address: String(formData.get("address") || ''),
      email: String(formData.get("email")),
      password,
    };

    setLoading(true);

    try {
      await authService.register(payload);

      router.replace("/login?registered=true");
      router.refresh();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;

        setError(
          Array.isArray(message)
            ? message.join(", ")
            : message ?? "Registration failed. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="space-y-3 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <UserRoundPlus className="size-7 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Register to access the Tool Monitor platform.
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>

          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            autoComplete="name"
            required
            maxLength={255}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nim">Student ID (NIM)</Label>

          <Input
            id="nim"
            name="nim"
            placeholder="Enter your student ID"
            required
            maxLength={30}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2"><Label htmlFor="studyProgram">Program Studi</Label><Input id="studyProgram" name="studyProgram" placeholder="Program studi" maxLength={150} className="h-11 rounded-xl" /></div>
        <div className="space-y-2"><Label htmlFor="whatsapp">Nomor HP / WhatsApp</Label><Input id="whatsapp" name="whatsapp" type="tel" placeholder="08xxxxxxxxxx" maxLength={30} autoComplete="tel" className="h-11 rounded-xl" /></div>
        <div className="space-y-2"><Label htmlFor="address">Alamat</Label><textarea id="address" name="address" placeholder="Alamat tempat tinggal" maxLength={2000} className="min-h-20 w-full rounded-xl border bg-background px-3 py-2 text-sm" /></div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            required
            maxLength={255}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 rounded-xl"
          />

          <p className="text-xs text-muted-foreground">
            Minimum 8 characters.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            className="h-11 rounded-xl"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="h-11 w-full rounded-xl"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">
            Or sign up with
          </span>
        </div>
      </div>

      {/* Google OAuth */}
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-xl"
        nativeButton={false}
        render={
          <a href={googleAuthUrl}>
            <svg
              className="mr-2 size-5"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />

              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.73 6C44.45 37.98 46.98 31.82 46.98 24.55Z"
              />

              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
              />

              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>

            Continue with Google
          </a>
        }
      />

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
