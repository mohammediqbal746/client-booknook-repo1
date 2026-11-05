"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // ==========================================
  //     JWT Token Create & Store in LocalStorage
  // ==========================================
  useEffect(() => {
    if (session?.user?.email) {
      fetch("http://localhost:5000/api/jwt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("access-token", data.token);
          }
        })
        .catch((err) => console.error("JWT Error:", err));
    } else {
      localStorage.removeItem("access-token");
    }
  }, [session?.user?.email]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      localStorage.removeItem("access-token");
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 md:px-8 py-3 sticky top-0 z-50">
      
      {/* Navbar Start - Logo & Mobile Menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 font-medium">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/books">All Books</Link></li>
            {session && (
              <>
                <li><Link href="/add-book">Add Book</Link></li>
                <li><Link href="/my-books">My Books</Link></li>
                <li><Link href="/my-borrows">My Borrows</Link></li>
              </>
            )}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-2xl font-bold text-primary gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c1.68 0 3.282.466 4.75 1.285a.75.75 0 001-.707V4.312a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
          </svg>
          BookNook
        </Link>
      </div>

      {/* Navbar Center - Desktop Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium text-gray-600 gap-1">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <li><Link href="/books" className="hover:text-primary">All Books</Link></li>
          {session && (
            <>
              <li><Link href="/add-book" className="hover:text-primary">Add Book</Link></li>
              <li><Link href="/my-books" className="hover:text-primary">My Books</Link></li>
              <li><Link href="/my-borrows" className="hover:text-primary">My Borrows</Link></li>
            </>
          )}
        </ul>
      </div>

      {/* Navbar End - Auth / Profile */}
      <div className="navbar-end gap-3">
        {!session ? (
          <>
            <Link href="/login" className="btn btn-outline btn-primary rounded-xl px-6">Login</Link>
            <Link href="/register" className="btn btn-primary rounded-xl px-6 hidden sm:flex">Register</Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-primary/20 p-0.5">
              <div className="w-10 rounded-full">
                <img alt="User Photo" src={session.user.image || "https://i.ibb.co/60V0C2R/user.png"} />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-3 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-60 border border-gray-100">
              <li className="px-4 py-3 border-b border-gray-100 mb-2">
                <p className="font-bold text-gray-800 p-0 text-base">{session.user.name}</p>
                <p className="text-xs text-gray-500 p-0 mt-1 truncate">{session.user.email}</p>
              </li>
              <li>
                <Link href="/profile" className="text-gray-700 font-medium hover:text-primary hover:bg-primary/5 rounded-xl py-2.5">
                  My Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-red-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-xl py-2.5 mt-1">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      
    </div>
  );
}