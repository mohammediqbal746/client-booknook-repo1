import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4 lg:px-10">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-2xl font-bold text-primary">
          BookNook
        </Link>
      </div>
      <div className="flex-none hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/books">All Books</Link></li>
          {/* Pore Authentication add korle ekhane My Books, Add Book, User Profile asbe */}
        </ul>
      </div>
      <div className="flex-none gap-2 ml-4">
        <Link href="/login" className="btn btn-primary btn-sm">Login</Link>
        <Link href="/register" className="btn btn-outline btn-sm">Register</Link>
      </div>
    </div>
  );
}