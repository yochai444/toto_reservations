"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

/**
 * Link to a home-page section. On the home page it just scrolls, leaving the address bar clean
 * (so reopening or refreshing the site starts at the top). From other pages it navigates to /#id.
 */
export function SectionLink({ id, onClick, ...props }: { id: string } & Omit<ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  return (
    <Link
      href={`/#${id}`}
      onClick={(e) => {
        onClick?.(e);
        if (pathname !== "/" || e.defaultPrevented) return;
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      {...props}
    />
  );
}
