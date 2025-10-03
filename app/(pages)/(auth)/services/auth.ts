export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  campus: "alangilan" | "pablo-borbon";
};

export type ApiResult<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export async function signup(payload: SignupPayload): Promise<ApiResult> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, error: data?.error || "Something went wrong" };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
