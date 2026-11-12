"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddBookPage() {
  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();
  
  // ইউজারের ইমেইলটি কনসোলে চেক করার জন্য
  useEffect(() => {
    console.log("Current User Email:", session?.user?.email);
  }, [session]);

  const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // যদি সেশন না থাকে, তাহলে বই অ্যাড করতে দেবে না
    if (!session?.user?.email) {
      toast.error("You must be logged in to add a book!");
      return;
    }

    setLoading(true);

    const form = e.target as HTMLFormElement;
    
    const newBook = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      author: (form.elements.namedItem("author") as HTMLInputElement).value,
      image: (form.elements.namedItem("image") as HTMLInputElement).value,
      category: (form.elements.namedItem("category") as HTMLSelectElement).value,
      quantity: parseInt((form.elements.namedItem("quantity") as HTMLInputElement).value),
      rating: parseFloat((form.elements.namedItem("rating") as HTMLInputElement).value),
      createdAt: new Date(),
      // এই লাইনটিই সবচেয়ে গুরুত্বপূর্ণ! এটি আপনার ইমেইল ডেটাবেজে পাঠাবে।
      adderEmail: session.user.email, 
    };

    try {
      const token = localStorage.getItem("access-token");
      
      const response = await fetch(`https://server-booknook-repo.vercel.app/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(newBook),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("বইটি সফলভাবে ডাটাবেজে যোগ করা হয়েছে! 🎉");
        form.reset();
      } else {
        toast.error("বই যোগ করতে সমস্যা হয়েছে!");
      }
    } catch (error) {
      toast.error("সার্ভারের সাথে কানেক্ট করা যাচ্ছে না!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
            Add a New Book
          </h1>
          <p className="text-gray-500 mt-2">Fill up the form to add a book to the library.</p>
        </div>

        <form onSubmit={handleAddBook} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="form-control w-full">
              <label className="label font-semibold text-gray-700">Book Name</label>
              <input type="text" name="name" placeholder="Enter book name" required className="input input-bordered rounded-xl focus:ring-2 focus:ring-primary/20 w-full" />
            </div>

            <div className="form-control w-full">
              <label className="label font-semibold text-gray-700">Author Name</label>
              <input type="text" name="author" placeholder="Enter author name" required className="input input-bordered rounded-xl focus:ring-2 focus:ring-primary/20 w-full" />
            </div>

            <div className="form-control w-full">
              <label className="label font-semibold text-gray-700">Cover Image URL</label>
              <input type="url" name="image" placeholder="https://example.com/image.jpg" required className="input input-bordered rounded-xl focus:ring-2 focus:ring-primary/20 w-full" />
            </div>

            <div className="form-control w-full">
              <label className="label font-semibold text-gray-700">Category</label>
              <select name="category" required defaultValue="" className="select select-bordered rounded-xl focus:ring-2 focus:ring-primary/20 w-full">
                <option value="" disabled>Select a category</option>
                <option value="Novel">Novel</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="History">History</option>
                <option value="Business">Business</option>
                <option value="Programming">Programming</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label font-semibold text-gray-700">Quantity</label>
              <input type="number" name="quantity" min="1" placeholder="Enter quantity" required className="input input-bordered rounded-xl focus:ring-2 focus:ring-primary/20 w-full" />
            </div>

            <div className="form-control w-full">
              <label className="label font-semibold text-gray-700">Rating (1-5)</label>
              <input type="number" name="rating" step="0.1" min="1" max="5" placeholder="e.g. 4.5" required className="input input-bordered rounded-xl focus:ring-2 focus:ring-primary/20 w-full" />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" disabled={loading} className="btn btn-primary w-full text-lg rounded-xl shadow-lg hover:scale-[1.01] transition-transform">
              {loading ? <span className="loading loading-spinner"></span> : "Add Book"}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}