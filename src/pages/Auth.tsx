import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
      }
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        navigate("/");
      }
    } else {
      if (!name.trim()) {
        toast.error("Please enter your name");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, name);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Please check your email to verify.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-display">
                  {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
                </CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Sign in to your Elite Bazar account"
                    : mode === "signup"
                    ? "Join Elite Bazar for a premium shopping experience"
                    : "Enter your email to receive a password reset link"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Muhammad Ali" className="pl-9" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="pl-9" required />
                    </div>
                  </div>
                  {mode !== "forgot" && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9 pr-10" required minLength={6} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90">
                    {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
                  </Button>
                </form>

                {mode === "login" && (
                  <button onClick={() => setMode("forgot")} className="w-full text-center mt-3 text-sm text-primary hover:underline">
                    Forgot Password?
                  </button>
                )}

                <div className="mt-4 text-center">
                  {mode === "forgot" ? (
                    <button onClick={() => setMode("login")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Back to <span className="text-primary font-medium">Sign In</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setMode(mode === "login" ? "signup" : "login")}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                      <span className="text-primary font-medium">
                        {mode === "login" ? "Sign Up" : "Sign In"}
                      </span>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
