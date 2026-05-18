import Link from "next/link";
import { HeartPulseIcon } from "@/components/landing/Icons";

export default function Footer() {
    return (
        <footer className="bg-sand-50 border-t border-sand-200 py-10 px-8">
            <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
                        <HeartPulseIcon size={15} className="text-white" />
                    </div>
                    <span className="font-serif text-[16px] text-ink-900">
                        ASHA Guru
                    </span>
                </Link>

                <p className="text-[13px] text-ink-400">
                    © {new Date().getFullYear()} ASHA Guru. Built for
                    India&apos;s frontline health workers.
                </p>

                <div className="flex gap-5">
                    {["Privacy", "Terms", "Contact"].map((l) => (
                        <Link
                            key={l}
                            href="#"
                            className="text-[13px] text-ink-400 hover:text-ink-900 transition-colors"
                        >
                            {l}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}
