"use client";

import Link from "next/link";
import classes from "./nav-link.module.css";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const path = usePathname(); // gives currentyl active path
  return (
    <Link
      href={href}
      className={
        path.startsWith(href)
          ? `${classes.link} ${classes.active}`
          : classes.link
      }
    >
      {children}
    </Link>
  );
}
