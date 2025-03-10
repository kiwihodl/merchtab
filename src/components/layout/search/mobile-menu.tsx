"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { sorting } from "@/app/lib/constants";
import ClientCollections from "./client-collections";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { createUrl } from "@/app/lib/utils";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [navHeight, setNavHeight] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() || "/search";
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the nav height when component mounts and on window resize
    const updateNavHeight = () => {
      const nav = document.querySelector("nav");
      if (nav) {
        setNavHeight(nav.offsetHeight);
      }
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);

    return () => window.removeEventListener("resize", updateNavHeight);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
    fetchCollections();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSort = () => {
    setSortOpen(!sortOpen);
  };

  const toggleCollections = () => {
    setCollectionsOpen(!collectionsOpen);
  };

  return (
    <>
      <div className="md:hidden">
        {/* Hamburger Button */}
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="relative z-[60] flex h-8 w-8 flex-col items-center justify-center gap-2"
        >
          <span
            className={`block h-0.5 w-6 transform transition-all duration-300 ${
              isOpen ? "translate-y-2.5 rotate-45 bg-accent" : "bg-white"
            }`}
          />
          <span
            className={`block h-0.5 w-4 transform transition-all duration-300 ${
              isOpen ? "opacity-0 bg-accent" : "bg-white"
            }`}
          />
          <span
            className={`block h-0.5 w-6 transform transition-all duration-300 ${
              isOpen ? "-translate-y-2.5 -rotate-45 bg-accent" : "bg-white"
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[50] md:hidden" ref={menuRef}>
          <div
            className="absolute left-0 right-0 min-h-[50vh] bg-black"
            style={{ top: `${navHeight}px` }}
          />
          <div
            className="relative flex min-h-[50vh] flex-col p-6"
            style={{ marginTop: `${navHeight - 4}px` }}
          >
            {/* Sort By Section */}
            <div className="mb-6">
              <button
                onClick={toggleSort}
                className="flex w-full items-center justify-between text-xl font-medium text-white"
              >
                <div className="flex items-center gap-2">
                  Sort by
                  <ChevronDownIcon
                    className={`h-5 w-5 transform transition-transform ${
                      sortOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
              {sortOpen && (
                <div className="mt-4 space-y-2">
                  {sorting.map((item) => {
                    const active = searchParams?.get("sort") === item.slug;
                    const href = createUrl(
                      pathname,
                      new URLSearchParams({
                        ...(searchParams?.get("q") && {
                          q: searchParams.get("q")!,
                        }),
                        ...(item.slug && { sort: item.slug }),
                      })
                    );
                    const DynamicTag = active ? "p" : Link;

                    return (
                      <DynamicTag
                        key={item.slug}
                        href={href}
                        className={`block text-lg ${
                          active
                            ? "text-accent"
                            : "text-neutral-300 hover:text-white"
                        }`}
                      >
                        {item.title}
                      </DynamicTag>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collections Section */}
            <div>
              <button
                onClick={toggleCollections}
                className="flex w-full items-center justify-between text-xl font-medium text-white"
              >
                <div className="flex items-center gap-2">
                  Collections
                  <ChevronDownIcon
                    className={`h-5 w-5 transform transition-transform ${
                      collectionsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
              {collectionsOpen && (
                <div className="mt-4">
                  <ClientCollections collections={collections} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
