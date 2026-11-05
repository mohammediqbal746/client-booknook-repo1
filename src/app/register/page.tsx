"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // পাসওয়ার্ড ভ্যালিডেশন ফাংশন
  const validatePassword = (pass: string) => {
    const uppercase = /[A-Z]/.test(pass);
    const lowercase = /[a-z]/.test(pass);
    const length = pass.length >= 6;
    if (!uppercase) return "Password must have at least one Uppercase letter.";
    if (!lowercase) return "Password must have at least one Lowercase letter.";
    if (!length) return "Password must be at least 6 characters long.";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passError = validatePassword(password);
    if (passError) {
      toast.error(passError);
      return;
    }

    setLoading(true);
    // BetterAuth দিয়ে সাইন-আপ
    const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: photo,
    }, {
        onRequest: () => {
          toast.loading("Registering...", { id: "register" });
        },
        onSuccess: () => {
          toast.success("Registration successful! Please login.", { id: "register" });
          router.push("/login");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message, { id: "register" });
        }
    });
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-10">
        <div className="card w-full max-w-md bg-base-100 shadow-xl border">
            <form onSubmit={handleRegister} className="card-body">
                <h2 className="text-2xl font-bold text-center mb-4 text-primary">Register</h2>
                
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Name</span></label>
                    <input type="text" placeholder="Your Name" className="input input-bordered" value={name} onChange={(e)=>setName(e.target.value)} required />
                </div>
                
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Email</span></label>
                    <input type="email" placeholder="Your Email" className="input input-bordered" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                </div>
                
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Photo URL</span></label>
                    <input type="url" placeholder="Photo URL" className="input input-bordered" value={photo} onChange={(e)=>setPhoto(e.target.value)} required />
                </div>
                
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Password</span></label>
                    <input type="password" placeholder="Password" className="input input-bordered" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                </div>
                
                <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </div>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login</Link>
                </p>
                
                <div className="divider">OR</div>
                
                <button type="button" onClick={handleGoogleLogin} className="btn btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                    Continue with Google
                </button>
            </form>
        </div>
    </div>
  );
}