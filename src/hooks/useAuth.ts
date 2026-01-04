import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const signUp = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (error) {
        toast.error(error.message || "Failed to sign up");
        return { error };
      }

      toast.success("Account created successfully!");
      return { data: true };
    } catch (error: any) {
      toast.error("An unexpected error occurred");
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Failed to login");
        return { error };
      }

      toast.success("Logged in successfully!");
      return { data: true };
    } catch (error: any) {
      toast.error("An unexpected error occurred");
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    loading,
    session: authClient.useSession(),
  };
};
