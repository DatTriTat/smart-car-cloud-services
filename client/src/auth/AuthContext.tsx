import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "OWNER" | "IOT" | "CLOUD";

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = "authUser";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as AuthUser;
      setUser(parsed);
    } catch {
      // ignore bad data
    }
  }, []);

  function loginAsRole(role: UserRole) {
    const fakeUser: AuthUser = {
      id:
        role === "OWNER"
          ? "u-owner-1"
          : role === "IOT"
          ? "u-iot-1"
          : "u-cloud-1",
      name:
        role === "OWNER"
          ? "Alex Owner"
          : role === "IOT"
          ? "Jamie IoT Engineer"
          : "Taylor Cloud Staff",
      role,
    };

    setUser(fakeUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fakeUser));
    }
  }

  function logout() {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  const value: AuthContextValue = {
    user,
    loginAsRole,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
