"use client";
import React, { useEffect, useState, useCallback, FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Book } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyBooksPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [bookToUpdate, setBookToUpdate] = useState<Book | null>(null);
  const [submitting, setSubmitting] = useState(false);

// Private Route Protection & Fetching Data
  useEffect(() => {
    if (isPending) return; // সেশন লোড হওয়া পর্যন্ত অপেক্ষা করবে

    if (!session) {
      toast.error("Please login to view your books!");
      router.push("/login");
      return;
    }

    // ডেটা ফেচ করার ফাংশন
    const fetchBooks = async () => {
      try {
        const res = await fetch(`https://server-booknook-repo.vercel.app/api/books?email=${session.user.email}`);
        const data = await res.json();
        if (data.success) {
          setBooks(data.books);
        }
      } catch (error) {
        toast.error("Failed to load your books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [session, isPending, router]);
  const openDeleteModal = (id: string) => {
    setBookToDelete(id);
    const modal = document.getElementById("delete_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const handleDelete = async () => {
    if (!bookToDelete) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`https://server-booknook-repo.vercel.app/api/books/${bookToDelete}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Book deleted successfully!");
        setBooks((prev) => prev.filter((b) => b._id !== bookToDelete));
        const modal = document.getElementById("delete_modal") as HTMLDialogElement;
        if (modal) modal.close();
      } else {
        toast.error(data.message || "Failed to delete book");
      }
    } catch (error) {
      toast.error("Error deleting book");
    } finally {
      setSubmitting(false);
      setBookToDelete(null);
    }
  };

  const openUpdateModal = (book: Book) => {
    setBookToUpdate(book);
    const modal = document.getElementById("update_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bookToUpdate) return;
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const author = (form.elements.namedItem("author") as HTMLInputElement).value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const image = (form.elements.namedItem("image") as HTMLInputElement).value;
    const rating = Number((form.elements.namedItem("rating") as HTMLInputElement).value);
    const quantity = Number((form.elements.namedItem("quantity") as HTMLInputElement).value);

    const updatedData = { name, author, category, image, rating, quantity };

    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`https://server-booknook-repo.vercel.app/api/books/${bookToUpdate._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Book updated successfully!");
        setBooks((prev) => prev.map((b) => b._id === bookToUpdate._id ? { ...b, ...updatedData } : b));
        const modal = document.getElementById("update_modal") as HTMLDialogElement;
        if (modal) modal.close();
      } else {
        toast.error("Failed to update book");
      }
    } catch (error) {
      toast.error("Error updating book");
    } finally {
      setSubmitting(false);
      setBookToUpdate(null);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Added Books</h1>
          <div className="badge badge-primary badge-outline p-4 font-semibold text-sm">
            Total: {books.length} Books
          </div>
        </div>

        {books.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-600 mb-4">You have not added any books yet.</h2>
            <Link href="/add-book" className="btn btn-primary">Add Your First Book</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="table">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th>Book</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Quantity</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={book.image} alt={book.name} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{book.name}</div>
                          <div className="text-sm opacity-50">{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-ghost badge-sm">{book.category}</span></td>
                    <td>{book.rating} ⭐</td>
                    <td className="font-semibold">{book.quantity}</td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openUpdateModal(book)} className="btn btn-sm btn-outline btn-info">Edit</button>
                        <button onClick={() => openDeleteModal(book._id)} className="btn btn-sm btn-outline btn-error">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-2xl">
          <h3 className="font-bold text-xl text-gray-800">Confirm Deletion</h3>
          <p className="py-4 text-gray-600">Are you sure you want to delete this book? This action cannot be undone.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2" onClick={() => setBookToDelete(null)}>Cancel</button>
            </form>
            <button onClick={handleDelete} disabled={submitting} className="btn btn-error text-white">
              {submitting ? <span className="loading loading-spinner"></span> : "Yes, Delete"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setBookToDelete(null)}>close</button>
        </form>
      </dialog>

      {/* Update Book Modal */}
      <dialog id="update_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-2xl max-w-2xl">
          <h3 className="font-bold text-2xl mb-6 text-gray-800">Update Book Details</h3>
          
          {bookToUpdate && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-medium text-gray-700">Book Name</label>
                  <input type="text" name="name" defaultValue={bookToUpdate.name} required className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label font-medium text-gray-700">Author Name</label>
                  <input type="text" name="author" defaultValue={bookToUpdate.author} required className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label font-medium text-gray-700">Category</label>
                  <select name="category" defaultValue={bookToUpdate.category} className="select select-bordered" required>
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Kids">Kids</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label font-medium text-gray-700">Rating (1-5)</label>
                  <input type="number" name="rating" min="1" max="5" defaultValue={bookToUpdate.rating} required className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label font-medium text-gray-700">Quantity</label>
                  <input type="number" name="quantity" min="0" defaultValue={bookToUpdate.quantity} required className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label font-medium text-gray-700">Image URL</label>
                  <input type="url" name="image" defaultValue={bookToUpdate.image} required className="input input-bordered" />
                </div>
              </div>
              
              <div className="modal-action mt-6">
                <button type="button" onClick={() => (document.getElementById("update_modal") as HTMLDialogElement)?.close()} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary px-8">
                  {submitting ? <span className="loading loading-spinner"></span> : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}