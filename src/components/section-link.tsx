"use client";

import Button, { type ButtonProps } from "@mui/material/Button";
import Link, { type LinkProps } from "@mui/material/Link";
import { usePathname } from "next/navigation";

export const SectionLink = ({ id, onClick, ...props }: { id: string } & Omit<LinkProps, "href">) => {
  const pathname = usePathname();
  return (
    <Link
      href={`/#${id}`}
      onClick={(e) => {
        onClick?.(e);
        if (pathname !== "/" || e.defaultPrevented) return;
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      }}
      {...props}
    />
  );
};

export const SectionButton = ({ section, ...props }: { section: string } & Omit<ButtonProps<typeof SectionLink>, "id" | "component">) => (
  <Button component={SectionLink} nativeButton={false} id={section} {...props} />
);
