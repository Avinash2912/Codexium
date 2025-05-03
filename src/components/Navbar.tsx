"use client"
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { CodeIcon, MenuIcon, XIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import DasboardBtn from "./DasboardBtn";
import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-md shadow-lg">
      <div className="container mx-auto flex h-16 items-center px-6 lg:px-10">
        {/* LEFT SIDE - LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3 font-mono text-2xl font-semibold transition-transform duration-200 hover:scale-105"
          aria-label="Codexium Home"
        >
          <CodeIcon className="w-8 h-8 text-emerald-500" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Codexium
          </span>
        </Link>

        {/* RIGHT SIDE - ACTIONS */}
        <div className="ml-auto hidden items-center space-x-5 lg:flex">
          <SignedIn>
            {/* Dashboard Button */}
            <DasboardBtn />

            {/* Dark Mode Toggle */}
            <ModeToggle />

            {/* User Profile */}
            <div className="relative">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="ml-auto block lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <XIcon className="w-6 h-6 text-white" />
          ) : (
            <MenuIcon className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black text-white">
          <SignedIn>
            <div className="flex flex-col items-center space-y-4 py-4">
              {/* Dashboard Button */}
              <DasboardBtn />

              {/* Dark Mode Toggle */}
              <ModeToggle />

              {/* User Profile */}
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
