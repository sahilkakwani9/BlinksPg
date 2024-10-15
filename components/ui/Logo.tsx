import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex" aria-label="Cruip">
      <img src="/logo.png" height={32} width={32} />
    </Link>
  );
}
