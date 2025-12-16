import Link from "next/link";
import AuthButtons from "./AuthButtons";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:opacity-90 transition">
          LinkedIn Resume Builder
        </Link>
        <AuthButtons />
      </div>
    </header>
  );
}