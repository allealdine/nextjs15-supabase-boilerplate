"use client";

import { useState } from "react";
import Link from "next/link";
import SSOButtons from "@/components/SSOButtons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import PasswordForm from "@/app/auth/login/password-form";
import MagicLinkForm from "@/app/auth/login/magic-link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to continue to your account.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg border-l-4 border-red-500 bg-red-50 text-red-700 text-sm flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
          <TabsTrigger
            value="password"
            className="rounded-md px-3 py-2 text-sm font-medium focus:outline-none data-[state=active]:bg-white data-[state=active]:shadow"
          >
            Password
          </TabsTrigger>
          <TabsTrigger
            value="magic"
            className="rounded-md px-3 py-2 text-sm font-medium focus:outline-none data-[state=active]:bg-white data-[state=active]:shadow"
          >
            Magic Link
          </TabsTrigger>
        </TabsList>
        <TabsContent value="password" className="py-4">
          <PasswordForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            error={error}
            setError={setError}
          />
        </TabsContent>
        <TabsContent value="magic" className="py-4">
          <MagicLinkForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            error={error}
            setError={setError}
          />
        </TabsContent>
      </Tabs>

      <SSOButtons onError={setError} />

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Don&#39;t have an account?</span>{" "}
        <Link
          href="/auth/register"
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
