"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signIn.email({
        email,
        password,
    }, {
        onRequest: () => {
          toast.loading("Logging in...", { id: "login" });
        },
        onSuccess: () => {
          toast.success("Welcome back!", { id: "login" });
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message, { id: "login" });
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
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-base-200/50 px-4 py-10">
        <div className="card w-full max-w-lg bg-base-100 shadow-2xl rounded-[2rem] p-6 md:p-10 border border-base-200">
            
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-primary mb-2">Welcome Back!</h2>
                <p className="text-gray-500">Log in to access your BookNook library</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Email Input */}
                <div className="form-control w-full">
                    <label className="label font-semibold text-gray-700 pb-1">
                        <span className="label-text">Email Address</span>
                    </label>
                    <div className="relative">
                        <input 
                            type="email" 
                            placeholder="hello@example.com" 
                            className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all bg-base-100" 
                            value={email} 
                            onChange={(e)=>setEmail(e.target.value)} 
                            required 
                        />
                        {/* Mail Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                </div>
                
                {/* Password Input */}
                <div className="form-control w-full">
                    <label className="label font-semibold text-gray-700 pb-1">
                        <span className="label-text">Password</span>
                    </label>
                    <div className="relative">
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all bg-base-100" 
                            value={password} 
                            onChange={(e)=>setPassword(e.target.value)} 
                            required 
                        />
                        {/* Lock Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <label className="label justify-end mt-1">
                        <a href="#" className="text-sm font-medium text-primary hover:underline transition-colors">Forgot password?</a>
                    </label>
                </div>
                
                {/* Login Button */}
                <button type="submit" className="btn btn-primary w-full rounded-xl text-lg mt-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all" disabled={loading}>
                    {loading ? <span className="loading loading-spinner loading-md"></span> : "Sign In"}
                </button>
            </form>

            <div className="divider text-gray-400 my-6 text-sm">OR</div>
            
            {/* Google Button */}
            <button 
                type="button" 
                onClick={handleGoogleLogin} 
                className="btn btn-outline w-full rounded-xl hover:bg-base-200 hover:text-base-content flex items-center justify-center gap-3 transition-colors border-gray-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                Continue with Google
            </button>

            {/* Register Link */}
            <p className="text-center mt-8 text-sm text-gray-600">
                Don&apos;t have an account? <Link href="/register" className="text-primary font-bold hover:underline ml-1">Sign up here</Link>
            </p>
        </div>
    </div>
  );
}