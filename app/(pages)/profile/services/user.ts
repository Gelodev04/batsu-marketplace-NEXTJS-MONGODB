export type UserProfile = {
  name: string;
  email: string;
  campus: string;
  image: string;
  role: string;
};

export type UpdateProfilePayload = {
  name?: string;
  campus?: string;
  image?: string;
};

export type ApiResult<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<ApiResult<{ user: UserProfile }>> {
  try {
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data?.error || "Failed to update profile" };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

export async function uploadImage(
  file: File
): Promise<ApiResult<{ url: string }>> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/profile", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: "Failed to upload image" };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

export async function getUserProfile(): Promise<
  ApiResult<{ user: UserProfile }>
> {
  try {
    const res = await fetch("/api/user/profile");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: data?.error || "Failed to fetch user profile",
      };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Network error" };
  }
}
