"use client";
import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Link from "next/link";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        const data = await response.json();
        if (data.success) {
          setBooks(data.books);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Banner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">New Arrivals</h2>
          <p className="text-gray-500 mt-2">Check out the latest books added to our library.</p>
        </div>

        {loading ? (
          <div className="flex justify-center my-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center my-20 text-gray-500 text-lg font-medium bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            No books found. Please add some books from the Add Book page!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <div key={book._id} className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
                <figure className="px-4 pt-4 overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.name}
                    className="rounded-xl h-64 w-full object-cover shadow-sm group-hover:scale-105 transition-transform duration-500"
                  />
                </figure>
                <div className="card-body p-6">
                  <div className="badge badge-primary badge-outline mb-2">{book.category}</div>
                  <h2 className="card-title text-xl font-bold line-clamp-1" title={book.name}>{book.name}</h2>
                  <p className="text-gray-600 font-medium truncate" title={book.author}>{book.author}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1 text-orange-500 font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {book.rating}
                    </div>
                    <div className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      Qty: {book.quantity}
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link href={`/books/${book._id}`} className="btn btn-primary w-full rounded-xl shadow-md hover:shadow-lg transition-shadow">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}