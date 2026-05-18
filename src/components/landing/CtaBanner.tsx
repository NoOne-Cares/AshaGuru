"use client";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/landing/Icons";
import { useReveal } from "@/app/hooks/useReveal";

export default function CtaBanner() {
    const ref = useReveal();

    return (
        <section className="bg-white py-20 px-8">
            <div className="max-w-[700px] mx-auto">
                <div
                    ref={ref}
                    className="reveal bg-teal-600 rounded-3xl px-12 py-16 text-center"
                >
                    <h2 className="font-serif text-[clamp(28px,4vw,40px)] leading-[1.1] text-white mb-4">
                        Your patients deserve
                        <br />
                        <em className="italic">the best of you.</em>
                    </h2>
                    <p className="text-[16px] text-teal-100 mb-8">
                        Join 12,000 ASHA workers who start every day with ASHA
                        Guru by their side.
                    </p>
                    <Link
                        href="/app"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-teal-600 text-[15px] font-medium hover:opacity-90 transition-opacity"
                    >
                        Start for free
                        <ArrowRightIcon size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
