"use client";
import React, { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Book } from "@/types";
import Link from "next/link";

export default function BookDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/books/${id}`);
        const data = await res.json();
        if (data.success) {
          setBook(data.book);
        }
      } catch (error) {
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const openBorrowModal = () => {
    if (!session) {
      toast.error("Please login to borrow a book!");
      router.push("/login");
      return;
    }
    const modal = document.getElementById("borrow_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const handleBorrowSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!book || !session) return;

    setBorrowing(true);
    const form = e.target as HTMLFormElement;
    const returnDate = (form.elements.namedItem("returnDate") as HTMLInputElement).value;

    const borrowData = {
      bookId: book._id,
      name: book.name,
      image: book.image,
      category: book.category,
      userName: session.user.name,
      userEmail: session.user.email,
      returnDate,
      borrowDate: new Date(),
    };

    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch("http://localhost:5000/api/borrows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, // <--- টোকেনটি এখানে সিকিউরডভাবে পাঠানো হলো
        },
        body: JSON.stringify(borrowData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Book borrowed successfully! 🎉");
        setBook((prev) => prev ? { ...prev, quantity: prev.quantity - 1 } : null);
        const modal = document.getElementById("borrow_modal") as HTMLDialogElement;
        if (modal) modal.close();
      } else {
        toast.error(data.message || "Failed to borrow book");
      }
    } catch (error) {
      toast.error("Error borrowing book");
    } finally {
      setBorrowing(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Book not found!</h2>
        <Link href="/all-books" className="btn btn-primary">Back to All Books</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center">
        
        <div className="w-full md:w-1/3 flex justify-center">
          <img src={book.image} alt={book.name} className="w-64 h-96 object-cover rounded-2xl shadow-md" />
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          <span className="badge badge-primary badge-outline font-semibold">{book.category}</span>
          <h1 className="text-3xl font-extrabold text-gray-800">{book.name}</h1>
          <p className="text-lg text-gray-600 font-medium">By: {book.author}</p>
          
          <div className="flex items-center gap-4 py-2">
            <span className="text-yellow-500 font-bold text-lg">⭐ {book.rating} / 5</span>
            <span className="text-gray-400">|</span>
            <span className="font-semibold text-gray-700">Available Quantity: {book.quantity}</span>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={openBorrowModal} 
              disabled={book.quantity <= 0} 
              className="btn btn-primary px-8 rounded-xl shadow-md"
            >
              {book.quantity > 0 ? "Borrow This Book" : "Out of Stock"}
            </button>
            <Link href="/all-books" className="btn btn-outline rounded-xl">Back to All Books</Link>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      <dialog id="borrow_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-2xl max-w-md">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Borrow Book</h3>
          
          <form onSubmit={handleBorrowSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label font-medium text-gray-700">Name</label>
              <input type="text" value={session?.user?.name || ""} disabled className="input input-bordered bg-gray-100" />
            </div>

            <div className="form-control">
              <label className="label font-medium text-gray-700">Email</label>
              <input type="email" value={session?.user?.email || ""} disabled className="input input-bordered bg-gray-100" />
            </div>

            <div className="form-control">
              <label className="label font-medium text-gray-700">Return Date</label>
              <input type="date" name="returnDate" required className="input input-bordered" />
            </div>

            <div className="modal-action mt-6">
              <form method="dialog">
                <button className="btn btn-ghost">Cancel</button>
              </form>
              <button type="submit" disabled={borrowing} className="btn btn-primary px-6">
                {borrowing ? <span className="loading loading-spinner"></span> : "Confirm Borrow"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}