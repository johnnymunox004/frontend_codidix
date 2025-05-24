"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Codidix
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
            Inicio
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">
            Acerca de
          </Link>
          <Link href="/services" className="text-gray-700 hover:text-indigo-600 transition-colors">
            Servicios
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors">
            Contacto
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-3">
              <Link href="/sign-in" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors">
                Sign Up
              </Link>
            </div>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};
