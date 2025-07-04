import { useState, useEffect } from "react";
import { UserSubscription } from "@shared/api";
<<<<<<< HEAD
=======
import { useUser } from "./use-auth";
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a

interface UseSubscriptionReturn {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  remainingGenerations: number;
  hasProAccess: boolean;
  isTrialExpired: boolean;
  refreshSubscription: () => Promise<void>;
}

<<<<<<< HEAD
// Mock user ID - in production, get from auth context
const MOCK_USER_ID = "user_123";

export function useSubscription(): UseSubscriptionReturn {
=======
export function useSubscription(): UseSubscriptionReturn {
  const { user } = useUser();
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check localStorage for subscription status first
      const localSubscription = localStorage.getItem("subscription");
      if (localSubscription) {
        const parsed = JSON.parse(localSubscription);
        setSubscription(parsed);
      }

<<<<<<< HEAD
      // Fetch from API
      const response = await fetch(`/api/subscription/${MOCK_USER_ID}`);
=======
      // Fetch from API using user email
      const response = await fetch(
        `/api/subscription/current?email=${encodeURIComponent(user?.email || "guest@musarty.com")}`,
      );
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a
      const result = await response.json();

      if (result.success && result.data) {
        setSubscription(result.data);
        localStorage.setItem("subscription", JSON.stringify(result.data));
      } else {
        // No subscription found - user is on free tier
        const freeSubscription: UserSubscription = {
<<<<<<< HEAD
          id: `free_${MOCK_USER_ID}`,
=======
          id: `free_${user?.email || "guest"}`,
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a
          planId: "free",
          status: "trial",
          startDate: new Date().toISOString(),
          remainingGenerations: parseInt(
            localStorage.getItem("remainingGenerations") || "3",
          ),
          features: ["3 free generations", "Basic AI tools"],
        };
        setSubscription(freeSubscription);
        localStorage.setItem("subscription", JSON.stringify(freeSubscription));
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch subscription",
      );

      // Fallback to localStorage or default free tier
      const localSubscription = localStorage.getItem("subscription");
      if (localSubscription) {
        setSubscription(JSON.parse(localSubscription));
      } else {
        const freeSubscription: UserSubscription = {
<<<<<<< HEAD
          id: `free_${MOCK_USER_ID}`,
=======
          id: `free_${user?.email || "guest"}`,
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a
          planId: "free",
          status: "trial",
          startDate: new Date().toISOString(),
          remainingGenerations: 3,
          features: ["3 free generations", "Basic AI tools"],
        };
        setSubscription(freeSubscription);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const remainingGenerations = subscription?.remainingGenerations || 0;
  const hasProAccess =
    subscription?.planId === "pro" && subscription?.status === "active";
  const isTrialExpired =
    subscription?.planId === "free" && remainingGenerations <= 0;

  return {
    subscription,
    loading,
    error,
    remainingGenerations,
    hasProAccess,
    isTrialExpired,
    refreshSubscription: fetchSubscription,
  };
}

// Helper function to consume a generation
export function useGeneration() {
  const consumeGeneration = () => {
    const current = parseInt(
      localStorage.getItem("remainingGenerations") || "3",
    );
    const newCount = Math.max(0, current - 1);
    localStorage.setItem("remainingGenerations", newCount.toString());

    // Update subscription in localStorage
    const subscription = localStorage.getItem("subscription");
    if (subscription) {
      const parsed = JSON.parse(subscription);
      parsed.remainingGenerations = newCount;
      localStorage.setItem("subscription", JSON.stringify(parsed));
    }

    return newCount;
  };

  const canGenerate = () => {
    const subscription = localStorage.getItem("subscription");
    if (subscription) {
      const parsed = JSON.parse(subscription);
      // Pro users can always generate (unless they're using our keys and out of credits)
      if (parsed.planId === "pro" && parsed.status === "active") {
        return true;
      }
      // Free users can generate if they have remaining generations
      return (parsed.remainingGenerations || 0) > 0;
    }
    return false;
  };

  return {
    consumeGeneration,
    canGenerate,
  };
}
