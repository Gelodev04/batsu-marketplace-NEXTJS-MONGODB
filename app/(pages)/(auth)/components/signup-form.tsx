"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "sonner";
import CampusSelect from "@/components/select/campus-select";
import { type CampusId } from "@/lib/campus";
import { signup } from "@/app/(pages)/(auth)/services/auth";
import { useGoogleSignIn } from "@/app/(pages)/(auth)/hooks/use-google-auth";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState<CampusId | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { googleLoading, signInWithGoogle } = useGoogleSignIn();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!campus || !name || !password || !email) {
      setError("Missing fields");
      setLoading(false);
      return;
    }

    const result = await signup({ name, email, password, campus });

    if (result.ok) {
      toast.success("Signup successful");
      router.push("/login");
    } else {
      setError(result.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Signup to your account</CardTitle>
          <CardDescription>
            Enter your email below to signup to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="email">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="campus">Campus</Label>
                <CampusSelect
                  value={campus}
                  onChange={(v) => setCampus(v)}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <CircularProgress size={16} />}
                  {loading ? "Signing up..." : "Signup"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => signInWithGoogle()}
                  disabled={googleLoading}
                >
                  {googleLoading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  )}
                  {googleLoading
                    ? "Connecting to Google..."
                    : "Sign up with Google"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
