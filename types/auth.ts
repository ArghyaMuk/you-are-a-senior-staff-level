export type SubscriptionTier = "free" | "pro" | "team" | "enterprise";

export interface AppUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  tier: SubscriptionTier;
}
