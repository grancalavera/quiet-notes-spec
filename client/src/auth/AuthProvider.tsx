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
  const [user, setUser] = useState<RecordModel | null>(
    pb.authStore.record ?? null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(pb.authStore.record ?? null);
    setIsLoading(false);

    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(record ?? null);
    });

    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    await pb.collection("users").authWithPassword(email, password);
  }

  function logout() {
    pb.authStore.clear();
  }

  return (
    <AuthContext value={{ user, isLoading, login, logout }}>
      {children}
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
