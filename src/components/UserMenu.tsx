"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center space-x-4">
        <span className="text-black">{user.name || user.email}</span>
        <div className="relative">
          <button
            type="button"
            className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            id="user-menu-button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-black">
              {user.name?.[0] || user.email?.[0]}
            </div>
          </button>
          {isOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex={-1}
            >
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                role="menuitem"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 