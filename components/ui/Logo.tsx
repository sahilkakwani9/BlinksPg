import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex" aria-label="Cruip">
       <img src="/logo.png" height={95} width={95} />
    </Link>
  );
}
