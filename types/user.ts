export type UserId = string;

export type UserProfile = {
  name: string;
  email: string;
  campus: string;
  image: string;
  role: string;
  followersCount: number;
  followingCount: number;
};

export type FollowPayload = { targetUserId: UserId };

export type UpdateProfilePayload = {
  name?: string;
  campus?: string;
  image?: string;
};
