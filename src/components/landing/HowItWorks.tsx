"use client";
import { useReveal } from "@/app/hooks/useReveal";

const steps = [
    {
        num: "1",
        title: "Open the app",
        body: "Access ASHA Guru on your smartphone — no installation needed. Works even on a slow 2G connection. Each patient gets their own session for easy record-keeping.",
    },
    {
        num: "2",
        title: "Ask anything",
        body: "Type or speak your question. Share a photo if needed. ASHA Guru understands clinical context, local conditions, and national health protocols automatically.",
    },
    {
        num: "3",
        title: "Act with confidence",
        body: "Get clear, actionable guidance within seconds. Generate documents, log activities, and escalate when needed — all without leaving the conversation.",
    },
];

export default function HowItWorks() {
    const headRef = useReveal();

    return (
        <section id="how" className="bg-sand-50 py-24 px-8">
            <div className="max-w-[1100px] mx-auto">
                <div ref={headRef} className="reveal">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-teal-600 mb-3">
                        How it works
                    </p>
                    <h2 className="font-serif text-[clamp(28px,4vw,42px)] leading-[1.12] text-ink-900 mb-4">
                        Simple as a conversation
                    </h2>
                    <p className="text-[16px] leading-[1.7] text-ink-400 max-w-[540px]">
                        No manuals, no training required. If you can send a
                        WhatsApp message, you can use ASHA Guru.
                    </p>
                </div>

                <div className="relative mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Connector line (desktop only) */}
                    <div className="hidden md:block absolute top-7 left-[calc(16.66%+28px)] right-[calc(16.66%+28px)] h-px bg-sand-200" />

                    {steps.map((s, i) => (
                        <Step key={s.num} {...s} delay={i * 100} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Step({
    num,
    title,
    body,
    delay,
}: {
    num: string;
    title: string;
    body: string;
    delay: number;
}) {
    const ref = useReveal();
    return (
        <div
            ref={ref}
            className="reveal relative"
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="relative z-10 w-14 h-14 rounded-full bg-white border border-sand-200 font-serif text-[22px] text-teal-600 flex items-center justify-center mb-5">
                {num}
            </div>
            <h3 className="font-serif text-[20px] text-ink-900 mb-2">
                {title}
            </h3>
            <p className="text-[14px] leading-[1.65] text-ink-400">{body}</p>
        </div>
    );
}
