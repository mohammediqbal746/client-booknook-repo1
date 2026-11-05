"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BorrowedBook {
  _id: string;
  bookId: string;
  name: string; // jodi apni bookName save kore thaken tahole 'bookName' diben
  image: string;
  category: string;
  returnDate: string;
}

export default function MyBorrowsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [borrows, setBorrows] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      toast.error("Please login to view borrowed books!");
      router.push("/login");
      return;
    }

    const fetchBorrows = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/borrows?email=${session.user.email}`);
        const data = await res.json();
        if (data.success) {
          setBorrows(data.borrows);
        }
      } catch (error) {
        toast.error("Failed to load borrowed books");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [session, isPending, router]);

  const handleReturn = async (borrowId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/borrows/${borrowId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Book returned successfully! Quantity updated.");
        setBorrows((prev) => prev.filter((b) => b._id !== borrowId));
      } else {
        toast.error(data.message || "Failed to return book");
      }
    } catch (error) {
      toast.error("Error returning book");
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Borrowed Books</h1>

        {borrows.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-600 mb-4">You have not borrowed any books yet.</h2>
            <Link href="/books" className="btn btn-primary">Browse Library</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrows.map((book) => (
              <div key={book._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-5 items-center hover:shadow-md transition-shadow">
                <div className="avatar">
                  <div className="w-20 rounded-lg shadow-sm">
                    <img src={book.image || "https://placehold.co/100x150?text=Book"} alt="Book Cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{book.name || "Book Name"}</h3>
                  <p className="text-sm text-gray-500 mb-2">{book.category || "General"}</p>
                  <p className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block mb-3">
                    Return by: <span className="text-red-500">{book.returnDate || "N/A"}</span>
                  </p>
                  <button 
                    onClick={() => handleReturn(book._id)} 
                    className="btn btn-sm btn-error w-full text-white"
                  >
                    Return Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}