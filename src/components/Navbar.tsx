"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className="navbar sticky top-0 z-[100] backdrop-blur-xl bg-white/70 border-b border-gray-100 shadow-sm px-4 md:px-8 transition-all duration-300">
      <div className="flex-1">
        <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent tracking-tight">
          BookNook
        </Link>
      </div>
      
      <div className="flex-none gap-4">
        {isPending ? (
          <span className="loading loading-spinner text-primary loading-sm"></span>
        ) : session ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar transition-transform hover:scale-105">
              <div className="w-10 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-white">
                <img 
                  alt="User Avatar" 
                  src={session.user.image || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"} 
                  className="object-cover"
                />
              </div>
            </div>
            
            <ul tabIndex={0} className="mt-4 z-[100] p-3 shadow-2xl menu menu-sm dropdown-content bg-white rounded-2xl w-60 border border-gray-100">
              <li className="mb-2 px-2 py-1">
                <div className="flex flex-col items-start gap-0.5 cursor-default hover:bg-transparent p-0">
                  <span className="font-bold text-gray-800 text-base">{session.user.name}</span>
                  <span className="text-xs text-gray-500 font-medium truncate w-full">{session.user.email}</span>
                </div>
              </li>
              
              <div className="h-[1px] bg-gray-100 w-full mb-2"></div>
              
              <li>
                <Link href="/" className="text-gray-700 font-medium hover:bg-gray-50 hover:text-primary rounded-xl py-2.5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-red-600 font-medium hover:bg-red-50 rounded-xl py-2.5 mt-1 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link href="/login" className="btn btn-ghost btn-sm rounded-xl font-semibold hover:bg-gray-100 transition-colors">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all hidden sm:flex">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
}