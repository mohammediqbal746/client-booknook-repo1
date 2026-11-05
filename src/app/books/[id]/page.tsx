"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Book } from "@/types";
import { authClient } from "@/lib/auth-client";

export default function BookDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const { data: session } = authClient.useSession();

  const fetchBookDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`);
      const data = await response.json();
      if (data.success) {
        setBook(data.book);
      }
    } catch (error) {
      toast.error("Error loading book details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id, fetchBookDetails]);

  const handleBorrow = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to borrow this book!");
      return;
    }

    setBorrowing(true);
    const form = e.target as HTMLFormElement;
    const returnDate = (form.elements.namedItem("returnDate") as HTMLInputElement).value;

    const borrowData = {
      bookId: book?._id,
      bookTitle: book?.name,
      bookImage: book?.image,
      userEmail: session.user.email,
      userName: session.user.name,
      borrowDate: new Date().toISOString().split("T")[0],
      returnDate: returnDate,
    };

    try {
      const response = await fetch("http://localhost:5000/api/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(borrowData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        const modal = document.getElementById("borrow_modal") as HTMLDialogElement;
        if (modal) modal.close();
        setBook((prev) => prev ? { ...prev, quantity: prev.quantity - 1 } : null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while borrowing!");
    } finally {
      setBorrowing(false);
    }
  };

  const openModal = () => {
    if (!session) {
      toast.error("Please login to borrow this book!");
      return;
    }
    const modal = document.getElementById("borrow_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-500">Book not found!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 h-96 md:h-[550px] bg-gray-100 p-6 flex items-center justify-center">
            <img src={book.image} alt={book.name} className="w-full h-full object-cover rounded-xl shadow-md" />
          </div>
          
          <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center">
            <div className="uppercase tracking-wide text-sm text-primary font-bold bg-primary/10 inline-block px-4 py-1.5 rounded-full w-max mb-4">
              {book.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">{book.name}</h1>
            <p className="text-xl text-gray-600 font-medium mb-6">by {book.author}</p>
            
            <div className="prose prose-gray mb-8">
              <p className="text-gray-600 leading-relaxed">
                {book.description || "A fascinating book that will take you on a journey through imagination and knowledge. Explore the depths of its pages and discover new horizons."}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mb-10">
              <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-lg font-bold text-gray-800">{book.rating} Rating</span>
              </div>
              <div className="text-lg text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
                <span className="font-bold text-gray-900">Available:</span> {book.quantity} copies
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={openModal}
                disabled={book.quantity === 0} 
                className="btn btn-primary flex-1 text-lg rounded-xl shadow-lg hover:scale-[1.02] transition-transform h-14 disabled:bg-gray-300 disabled:text-gray-500"
              >
                {book.quantity === 0 ? "Not Available" : "Borrow This Book"}
              </button>
              <Link href="/" className="btn btn-outline flex-1 text-lg rounded-xl hover:bg-gray-50 transition-colors h-14">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <dialog id="borrow_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-2xl p-8">
          <h3 className="font-bold text-2xl mb-6 text-gray-800">Borrow Book</h3>
          <form onSubmit={handleBorrow} className="space-y-4">
            <div className="form-control">
              <label className="label font-medium text-gray-700">Name</label>
              <input type="text" value={session?.user?.name || ""} readOnly className="input input-bordered bg-gray-50 text-gray-500 focus:outline-none" />
            </div>
            <div className="form-control">
              <label className="label font-medium text-gray-700">Email</label>
              <input type="email" value={session?.user?.email || ""} readOnly className="input input-bordered bg-gray-50 text-gray-500 focus:outline-none" />
            </div>
            <div className="form-control">
              <label className="label font-medium text-gray-700">Return Date</label>
              <input type="date" name="returnDate" required className="input input-bordered focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="modal-action mt-6">
              <button type="button" onClick={() => (document.getElementById("borrow_modal") as HTMLDialogElement)?.close()} className="btn btn-ghost">Cancel</button>
              <button type="submit" disabled={borrowing} className="btn btn-primary px-8">
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