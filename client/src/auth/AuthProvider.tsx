import { RecordModel } from "pocketbase";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { pb } from "../lib/pocketbase";

interface AuthContextType {
  user: RecordModel | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RecordModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      const minDelay = new Promise((r) => setTimeout(r, 100));

      try {
        await pb.collection("users").authRefresh();
        if (!cancelled) setUser(pb.authStore.record ?? null);
      } catch {
        pb.authStore.clear();
      }

      await minDelay;
      if (!cancelled) setIsLoading(false);
    }

    initAuth();

    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(record ?? null);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  async function login(email: string, password: string) {
    await pb.collection("users").authWithPassword(email, password);
  }

  function logout() {
    pb.authStore.clear();
  }

  return (
    <AuthContext value={{ user, isLoading, login, logout }}>
      {isLoading ? (
        <div role="status" aria-label="Loading">
          Loading…
        </div>
      ) : (
        children
      )}
    </AuthContext>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
