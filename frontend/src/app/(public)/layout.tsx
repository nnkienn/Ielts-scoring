"use client";
import { useState } from "react";


export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
        <main className="flex-1">{children}</main>
  );
}