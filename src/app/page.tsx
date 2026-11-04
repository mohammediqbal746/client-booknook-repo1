export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold text-primary mb-4">Welcome to BookNook</h1>
      <p className="text-lg text-gray-600 max-w-xl text-center">
        Your favorite online library. Add a book, borrow a book, return a book.
      </p>
    </div>
  );
}