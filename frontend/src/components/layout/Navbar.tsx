import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40  h-16 shadow bg-white flex items-center">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/images/imageLogoNavbar.png"
            alt="Logo"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-gray-400 font-bold text-lg sm:text-2xl truncate">
            IELTS<span className="text-teal-600">Scoring</span>
          </span>
        </div>

        {/* Button */}
        <Link
          href="/signin"
          className="text-gray-400 font-bold text-xs sm:text-sm border px-3 py-1 rounded-3xl hover:bg-teal-600 hover:text-white flex items-center"
        >
          <span className="sm:hidden">Login</span>
          <span className="hidden sm:inline">► Sign up / Log in</span>
        </Link>
      </div>
    </header>
  );
}