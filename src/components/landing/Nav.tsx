"use client";
import Link from "next/link";
import { HeartPulseIcon } from "@/components/landing/Icons";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-[58px] bg-sand-50/90 backdrop-blur-md border-b border-sand-200">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[8px] bg-teal-600 flex items-center justify-center flex-shrink-0">
          <HeartPulseIcon className="text-white" size={18} />
        </div>
        <span className="font-serif text-[18px] text-ink-900 leading-none">ASHA Guru</span>
      </Link>

      <ul className="hidden md:flex items-center gap-7 list-none">
        {[
          ["Features", "#features"],
          ["How it works", "#how"],
          ["Use cases", "#use-cases"],
          ["Stories", "#testimonials"],
        ].map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-[14px] text-ink-400 hover:text-ink-900 transition-colors">
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/app"
            className="px-5 py-2 rounded-full bg-teal-600 text-white text-[14px] font-medium hover:bg-teal-800 transition-colors"
          >
            Open App
          </Link>
        </li>
      </ul>
    </nav>
  );
}
