import { createSPASassClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";

interface MagicLinkFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string;
  setError: (error: string) => void;
}

export default function MagicLinkForm({
  isLoading,
  setIsLoading,
  error,
  setError,
}: MagicLinkFormProps) {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [showMFAPrompt, setShowMFAPrompt] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const client = await createSPASassClient();
      const { error: signInError } = await client.loginWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (signInError) throw signInError;

      // Check if MFA is required
      const supabase = client.getSupabaseClient();
      const { data: mfaData, error: mfaError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (mfaError) throw mfaError;

      setIsSent(true);
      showToast({
        title: "Magic link sent",
        description: "Check your email for the login link",
      });

      if (
        mfaData.nextLevel === "aal2" &&
        mfaData.nextLevel !== mfaData.currentLevel
      ) {
        setShowMFAPrompt(true);
      } else {
        router.push("/app");
        return;
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showMFAPrompt) {
      router.push("/auth/2fa");
    }
  }, [showMFAPrompt, router]);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-xs focus:border-primary-500 focus:outline-hidden focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isLoading || isSent}
        >
          {isLoading
            ? "Sending..."
            : isSent
            ? "Check your email"
            : "Send magic link"}
        </button>
      </div>
    </form>
  );
}
