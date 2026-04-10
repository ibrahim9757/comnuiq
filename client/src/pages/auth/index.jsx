import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store/slices";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

function Auth() {
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateSignup = () => {
    if (!email.length || !password.length || !confirmPassword.length) {
      toast.error("All fields are required!");
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email!");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length || !password.length) {
      toast.error("Email and Password are required!");
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email!");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoginLoading(true);
    try {
      const res = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.user.id) {
        setUserInfo(res.data.user);
        toast.success("Logged In");
        navigate(res.data.user.profileSetup ? "/chat" : "/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;
    setSignupLoading(true);
    try {
      const res = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setUserInfo(res.data.user);
        toast.success("Account Created");
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.message || "Signup failed!");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center font-poppins bg-gradient-to-br from-gray-800 to-black">
      <div className="sm:w-full max-w-md sm:max-w-lg min-h-[500px] p-10 bg-gray-800/70 backdrop-blur-md text-white rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-center text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-400">
          Welcome to ComuniQ
        </h2>
        <p className="text-center text-gray-400 mt-1 mb-6 text-xs">
          Enter your credentials to continue
        </p>

        <Tabs defaultValue="login">
          <TabsList className="flex justify-between bg-transparent mb-6">
            <TabsTrigger
              value="login"
              className="w-1/2 text-center data-[state=active]:text-white data-[state=active]:bg-gray-700 data-[state=active]:rounded-lg border-b rounded-none bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-yellow-400"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="w-1/2 text-center data-[state=active]:text-white data-[state=active]:bg-gray-700 data-[state=active]:rounded-lg border-b rounded-none bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-orange-400"
            >
              Signup
            </TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <div className="space-y-4">
              <Input
                placeholder="Email"
                type="email"
                className="bg-gray-700 border-none p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="bg-gray-700 border-none p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-yellow-500 hover:to-yellow-600 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Signup Form */}
          <TabsContent value="signup">
            <div className="space-y-4">
              <Input
                placeholder="Email"
                type="email"
                className="bg-gray-700 border-none p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="bg-gray-700 border-none p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="bg-gray-700 border-none p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-yellow-500 hover:to-yellow-600 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                onClick={handleSignup}
                disabled={signupLoading}
              >
                {signupLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-gray-400 text-sm">
          OR CONTINUE WITH
        </div>

        <div className="flex justify-center mt-4">
          <Button
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => {
              const apiUrl =
                import.meta.env.VITE_API_URL ?? import.meta.env.VITE_SERVER_URL;
              window.location.href = `${apiUrl}/api/auth/google`;
            }}
          >
            <FcGoogle className="w-5 h-5" />
            <span>Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
