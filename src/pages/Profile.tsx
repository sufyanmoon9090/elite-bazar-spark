import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { User, Save, Mail, Phone, MapPin, Home } from "lucide-react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState<any>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  if (!user) return <Navigate to="/auth" replace />;

  // Initialize form from profile (or defaults when no profile exists yet)
  if (!isLoading && !form) {
    setForm({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      city: profile?.city || "",
      address: profile?.address || "",
    });
  }

  const handleSave = async () => {
    if (!form || !user) return;
    try {
      await updateProfile.mutateAsync({ id: user.id, ...form });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated!");
      setNewPassword("");
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold mb-8">
              My <span className="text-gradient-gold">Profile</span>
            </h1>

            {isLoading || !form ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" /> Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
                      <Input value={user.email || ""} disabled className="bg-muted" />
                    </div>
                    <div>
                      <Label className="flex items-center gap-1"><User className="h-3 w-3" /> Full Name</Label>
                      <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" />
                    </div>
                    <div>
                      <Label className="flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</Label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+92 3XX XXXXXXX" />
                    </div>
                    <div>
                      <Label className="flex items-center gap-1"><MapPin className="h-3 w-3" /> City</Label>
                      <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Lahore, Karachi, Islamabad..." />
                    </div>
                    <div>
                      <Label className="flex items-center gap-1"><Home className="h-3 w-3" /> Address</Label>
                      <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House #, Street, Area" />
                    </div>
                    <Button onClick={handleSave} disabled={updateProfile.isPending} className="gap-2 bg-gradient-gold text-primary-foreground">
                      <Save className="h-4 w-4" /> {updateProfile.isPending ? "Saving..." : "Save Profile"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      🔒 Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {changingPassword ? (
                      <div className="space-y-3">
                        <div>
                          <Label>New Password</Label>
                          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleChangePassword} className="gap-2">Update Password</Button>
                          <Button variant="outline" onClick={() => setChangingPassword(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => setChangingPassword(true)}>Change Password</Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
