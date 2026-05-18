"use client";
import Link from "next/link";
import {
    ArrowRightIcon,
    CheckCircleIcon,
    AlertTriangleIcon,
    SendIcon,
} from "@/components/landing/Icons";
import { useReveal } from "@/app/hooks/useReveal";

export default function Hero() {
    const copyRef = useReveal();
    const visualRef = useReveal();

    return (
        <section className="max-w-[1100px] mx-auto px-8 pt-28 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div ref={copyRef} className="reveal">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-600 text-[12px] font-medium px-3 py-1.5 rounded-full border border-teal-100 mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-[pulse-dot_2s_ease-in-out_infinite]" />
                    Now live in 6 Indian states
                </div>

                <h1 className="font-serif text-[clamp(38px,5vw,58px)] leading-[1.08] tracking-[-0.02em] text-ink-900 mb-5">
                    Healthcare
                    <br />
                    <em className="italic text-teal-600">intelligence</em>
                    <br />
                    for every ASHA
                </h1>

                <p className="text-[17px] leading-[1.7] text-ink-400 max-w-[440px] mb-8">
                    ASHA Guru puts a trained clinical advisor in your pocket —
                    available in your language, anytime, anywhere. Ask
                    questions, generate referrals, report outbreaks, and grow
                    your skills through AI-guided training.
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                    <Link
                        href="/app"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-600 text-white text-[15px] font-medium hover:bg-teal-800 transition-all hover:-translate-y-px"
                    >
                        Start using ASHA Guru
                        <ArrowRightIcon size={16} />
                    </Link>
                    <Link
                        href="#how"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-sand-200 text-ink-900 text-[15px] font-medium hover:bg-sand-100 hover:border-ink-400 transition-colors"
                    >
                        See how it works
                    </Link>
                </div>

                {/* Trust bar */}
                <div className="flex items-center gap-2.5 mt-7">
                    <div className="flex">
                        {[
                            {
                                initials: "PD",
                                bg: "bg-teal-50",
                                text: "text-teal-600",
                            },
                            {
                                initials: "RS",
                                bg: "bg-[#FEE9E0]",
                                text: "text-[#7C3D2B]",
                            },
                            {
                                initials: "MK",
                                bg: "bg-[#EDE9FE]",
                                text: "text-[#4C3A8F]",
                            },
                        ].map((a, i) => (
                            <div
                                key={a.initials}
                                className={`w-[30px] h-[30px] rounded-full border-2 border-sand-50 ${a.bg} ${a.text} text-[11px] font-semibold flex items-center justify-center ${i > 0 ? "-ml-2" : ""}`}
                            >
                                {a.initials}
                            </div>
                        ))}
                    </div>
                    <p className="text-[13px] text-ink-400">
                        <span className="text-ink-900 font-medium">
                            12,000+
                        </span>{" "}
                        ASHA workers trust ASHA Guru
                    </p>
                </div>
            </div>

            {/* Visual */}
            <div
                ref={visualRef}
                className="reveal hidden md:block relative [transition-delay:150ms]"
            >
                {/* Floating badge — top right */}
                <div className="absolute -top-4 -right-4 z-10 flex items-center gap-2 bg-white border border-sand-200 rounded-2xl px-3 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] animate-[float_4s_ease-in-out_infinite]">
                    <div className="w-[30px] h-[30px] rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircleIcon size={16} />
                    </div>
                    <div>
                        <p className="text-[11px] text-ink-400 leading-none mb-0.5">
                            Referrals generated
                        </p>
                        <p className="text-[13px] font-semibold text-ink-900 leading-none">
                            84,200+
                        </p>
                    </div>
                </div>

                {/* Chat mockup */}
                <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_8px_40px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 bg-sand-50 border-b border-sand-200 px-3.5 py-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF6057]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] mx-1" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                        <span className="ml-auto text-[11px] text-ink-400">
                            ASHA Guru
                        </span>
                    </div>

                    {/* Messages */}
                    <div className="p-4 flex flex-col gap-2.5 min-h-[220px]">
                        <div className="self-end max-w-[75%] bg-teal-600 text-white text-[13px] leading-relaxed px-3.5 py-2.5 rounded-[14px_2px_14px_14px]">
                            A patient has a fever of 104°F and is 7 months
                            pregnant. What should I do?
                        </div>
                        <div className="self-start max-w-[82%] bg-sand-50 border border-sand-200 text-ink-900 text-[13px] leading-relaxed px-3.5 py-2.5 rounded-[2px_14px_14px_14px]">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400 mb-1">
                                ASHA Guru
                            </p>
                            High fever in late pregnancy is a serious warning
                            sign. Refer immediately to PHC. Keep her hydrated
                            and apply a cool cloth — do not give aspirin. Note
                            vital signs for the doctor.
                        </div>
                        <div className="self-end max-w-[75%] bg-teal-600 text-white text-[13px] leading-relaxed px-3.5 py-2.5 rounded-[14px_2px_14px_14px]">
                            Can you generate a referral slip?
                        </div>
                        <div className="self-start max-w-[82%] bg-sand-50 border border-sand-200 text-ink-900 text-[13px] leading-relaxed px-3.5 py-2.5 rounded-[2px_14px_14px_14px]">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400 mb-1">
                                ASHA Guru
                            </p>
                            ✅ Referral generated. Chief complaint: pyrexia in
                            third trimester. Urgency: High. Sent to nearest PHC.
                        </div>
                    </div>

                    {/* Input bar */}
                    <div className="border-t border-sand-200 px-3.5 py-2.5 flex items-center gap-2">
                        <div className="flex-1 h-[34px] rounded-full bg-sand-50 border border-sand-200 px-3.5 flex items-center text-[12px] text-ink-400">
                            Type your message…
                        </div>
                        <div className="w-[34px] h-[34px] rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                            <SendIcon size={14} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Floating badge — bottom left */}
                <div className="absolute -bottom-4 -left-5 z-10 flex items-center gap-2 bg-white border border-sand-200 rounded-2xl px-3 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] animate-[float_4s_ease-in-out_2s_infinite]">
                    <div className="w-[30px] h-[30px] rounded-lg bg-[#FEE9E0] text-[#7C3D2B] flex items-center justify-center flex-shrink-0">
                        <AlertTriangleIcon size={16} />
                    </div>
                    <div>
                        <p className="text-[11px] text-ink-400 leading-none mb-0.5">
                            Active outbreak alert
                        </p>
                        <p className="text-[13px] font-semibold text-[#993C1D] leading-none">
                            Dengue — East sector
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
