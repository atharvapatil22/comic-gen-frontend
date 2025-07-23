// src/components/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-[60px] flex items-center justify-between px-6 border-b-4 shadow-sm bg text-black bg-gray-100">
      <h1 className="text-xl font-semibold">Recipe Comic Generator</h1>

      <div className="flex items-center gap-4">
        <Link href="/gallery" className="text-lg hover:underline">
          Gallery
        </Link>

        <button
          className="text-2xl focus:outline-none"
          onClick={() => {
            // Placeholder action — safe now!
            console.log("Hamburger clicked");
          }}
        >
          &#9776;
        </button>
      </div>
    </nav>
  );
}
