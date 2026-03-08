import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, ArrowLeft } from "lucide-react";
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

  // Forgot password flow states
  const [forgotStep, setForgotStep] = useState<"email" | "sent">("email");

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
        setForgotStep("sent");
        toast.success("Password reset link sent! Check your email.");
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

  const goBackToLogin = () => {
    setMode("login");
    setForgotStep("email");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={mode + forgotStep}>
            <Card className="border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-display">
                  {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : forgotStep === "sent" ? "Check Your Email" : "Reset Password"}
                </CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Sign in to your Elite Bazar account"
                    : mode === "signup"
                    ? "Join Elite Bazar for a premium shopping experience"
                    : forgotStep === "sent"
                    ? "We've sent a password reset link to your email"
                    : "Enter your email to receive a password reset link"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Forgot Password - Link Sent Step */}
                {mode === "forgot" && forgotStep === "sent" ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-sm text-foreground font-medium">Reset link sent to:</p>
                        <p className="text-sm text-primary font-semibold">{email}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Click the link in your email to reset your password. The link will redirect you back here to set a new password.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => {
                          setForgotStep("email");
                        }}
                      >
                        <Mail className="h-4 w-4" /> Resend Link
                      </Button>
                      <button onClick={goBackToLogin} className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
                        <ArrowLeft size={14} /> Back to Sign In
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                      <button onClick={() => { setMode("forgot"); setForgotStep("email"); }} className="w-full text-center mt-3 text-sm text-primary hover:underline">
                        Forgot Password?
                      </button>
                    )}

                    <div className="mt-4 text-center">
                      {mode === "forgot" ? (
                        <button onClick={goBackToLogin} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 w-full">
                          <ArrowLeft size={14} /> Back to <span className="text-primary font-medium ml-1">Sign In</span>
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
                  </>
                )}
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
