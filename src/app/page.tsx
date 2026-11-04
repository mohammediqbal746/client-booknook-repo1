import Banner from "@/components/Banner";
import Link from "next/link";

export default function Home() {
  return (
    <div className="px-4 lg:px-10">
      {/* 1. Banner Section */}
      <Banner />

      {/* 2. New Arrivals (আপাতত স্ট্রাকচার, পরে ব্যাকএন্ড থেকে ডেটা আনব) */}
      <section className="my-20">
        <h2 className="text-3xl font-bold text-center mb-10">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* কার্ডগুলো এখানে বসবে */}
           <div className="text-center col-span-full">
              <p className="text-gray-500 mb-4">Loading latest books...</p>
              <Link href="/books" className="btn btn-outline btn-primary">See All Books</Link>
           </div>
        </div>
      </section>

      {/* 3. Extra Section 1: How Borrowing Works */}
      <section className="my-20 bg-base-200 p-10 rounded-2xl">
        <h2 className="text-3xl font-bold text-center mb-10">How Borrowing Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Find a Book</h3>
            <p className="text-gray-600">Browse our extensive collection and find a book you love.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Borrow</h3>
            <p className="text-gray-600">Click borrow and it gets added to your reading list instantly.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Return</h3>
            <p className="text-gray-600">Once you finish reading, return it for others to enjoy.</p>
          </div>
        </div>
      </section>

      {/* 4. Extra Section 2: Top Categories */}
      <section className="my-20">
        <h2 className="text-3xl font-bold text-center mb-10">Top Categories</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="badge badge-lg p-6 text-lg cursor-pointer hover:bg-primary hover:text-white transition">Fiction</div>
          <div className="badge badge-lg p-6 text-lg cursor-pointer hover:bg-primary hover:text-white transition">Science</div>
          <div className="badge badge-lg p-6 text-lg cursor-pointer hover:bg-primary hover:text-white transition">History</div>
          <div className="badge badge-lg p-6 text-lg cursor-pointer hover:bg-primary hover:text-white transition">Kids</div>
          <div className="badge badge-lg p-6 text-lg cursor-pointer hover:bg-primary hover:text-white transition">Thriller</div>
        </div>
      </section>
    </div>
  );
}