"use client";

import React, { useState } from "react";
import { Button, ScreenReaderOnly } from "@/shared/ui";
import Link from "next/link";
import { useNavigationContext } from "../NavContext";
 
type NavLink = {
  href: string;
  label: string;
};

type MobileMenuToggleProps = {
  navLinks: NavLink[];
};

export const MobileMenuToggleButton: React.FC = () => {
  const { isOpen, setOpen } = useNavigationContext();

  return (
    <div className="-mr-2 flex md:hidden">
      <Button
        variant="text"
        onClick={() => setOpen(!isOpen)}
        type="button"
        className="bg-background inline-flex items-center justify-center p-2 rounded-md text-color-text-default hover:text-color-text-information focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-600"
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
      >
        <ScreenReaderOnly className="sr-only">메뉴 열기</ScreenReaderOnly>
        {!isOpen ? (
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        ) : (
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </Button>
    </div>
  );
};

export const MobileMenuDropdown: React.FC<MobileMenuToggleProps> = ({ navLinks }) => {
  const { isOpen } = useNavigationContext();

  return (
    <>
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-800 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
