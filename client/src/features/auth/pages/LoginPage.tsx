import { useAuth, type UserRole } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const navigatedItems = {
  OWNER: "/owner/overview",
  IOT: "/iot/devices",
  CLOUD: "/cloud/overview",
};

export function LoginPage() {
  const { user, loginAsRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    navigate(navigatedItems[user.role], { replace: true });
  }, [user, navigate]);

  function handleLogin(role: UserRole) {
    loginAsRole(role);
    if (!user) return;
    navigate(navigatedItems[user.role], { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-lg">Sign in to Smart Car Cloud</CardTitle>
          <CardDescription>Choose a role to sign in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Button
              className="w-full hover:cursor-pointer bg-amber-500"
              onClick={() => handleLogin("OWNER")}
            >
              Sign in as Smart Car Owner
            </Button>
            <Button
              className="w-full hover:cursor-pointer bg-blue-500"
              onClick={() => handleLogin("IOT")}
            >
              Sign in as IoT / Devices Team
            </Button>
            <Button
              className="w-full hover:cursor-pointer"
              onClick={() => handleLogin("CLOUD")}
            >
              Sign in as Cloud Service Staff
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
