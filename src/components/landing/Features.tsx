"use client";
import {
    StethoscopeIcon,
    GraduationCapIcon,
    FileTextIcon,
    BarChartIcon,
    AlertTriangleIcon,
    MicIcon,
} from "@/components/landing/Icons";
import { useReveal } from "@/app/hooks/useReveal";

import type { ReactNode } from "react";

const features: { icon: ReactNode; title: string; body: string }[] = [
    {
        icon: <StethoscopeIcon size={20} />,
        title: "Clinical support",
        body: "Instant, evidence-based guidance on maternal health, immunisation schedules, nutrition, and common conditions — tailored to national health guidelines.",
    },
    {
        icon: <GraduationCapIcon size={20} />,
        title: "Role-play training",
        body: "Practice real patient scenarios through interactive AI simulations. Build confidence before difficult field visits — at your own pace, any time.",
    },
    {
        icon: <FileTextIcon size={20} />,
        title: "Referral generation",
        body: "Generate complete referral slips in seconds with auto-filled patient details, symptoms, vitals, and urgency level. No more paper forms.",
    },
    {
        icon: <BarChartIcon size={20} />,
        title: "Monthly reporting",
        body: "Automatically compile home visits, immunisations, referrals, and follow-ups into a formatted monthly report ready for your supervisor.",
    },
    {
        icon: <AlertTriangleIcon size={20} />,
        title: "Outbreak alerts",
        body: "Real-time disease surveillance alerts relevant to your area — with plain-language guidance on what to do and who to notify right now.",
    },
    {
        icon: <MicIcon size={20} />,
        title: "Voice & image input",
        body: "Speak your question in Hindi, Bengali, Tamil, or Telugu — or photograph a patient document — and get an immediate response. No typing needed.",
    },
];

export default function Features() {
    const headRef = useReveal();

    return (
        <section id="features" className="bg-white py-24 px-8">
            <div className="max-w-[1100px] mx-auto">
                <div ref={headRef} className="reveal">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-teal-600 mb-3">
                        Core capabilities
                    </p>
                    <h2 className="font-serif text-[clamp(28px,4vw,42px)] leading-[1.12] text-ink-900 mb-4">
                        Everything an ASHA
                        <br />
                        worker needs — unified
                    </h2>
                    <p className="text-[16px] leading-[1.7] text-ink-400 max-w-[540px]">
                        Clinical guidance, training, paperwork, and outbreak
                        alerts — all in one conversational interface, in your
                        language.
                    </p>
                </div>

                {/* Grid with hairline dividers */}
                <div className="mt-14 grid grid-cols-1 md:grid-cols-3 border border-sand-200 rounded-2xl overflow-hidden divide-y md:divide-y-0 divide-sand-200">
                    {features.map((f, i) => (
                        <FeatureCard
                            key={f.title}
                            {...f}
                            delay={i * 80}
                            hasBorderRight={i % 3 !== 2}
                            hasBorderTop={i >= 3}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({
    icon,
    title,
    body,
    delay,
    hasBorderRight,
    hasBorderTop,
}: {
    icon: ReactNode;
    title: string;
    body: string;
    delay: number;
    hasBorderRight: boolean;
    hasBorderTop: boolean;
}) {
    const ref = useReveal();
    return (
        <div
            ref={ref}
            className={`reveal group p-8 bg-white hover:bg-sand-50 transition-colors cursor-default
        ${hasBorderRight ? "md:border-r border-sand-200" : ""}
        ${hasBorderTop ? "md:border-t border-sand-200" : ""}
      `}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="w-11 h-11 rounded-[10px] bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
                {icon}
            </div>
            <h3 className="font-serif text-[20px] text-ink-900 mb-2">
                {title}
            </h3>
            <p className="text-[14px] leading-[1.65] text-ink-400">{body}</p>
        </div>
    );
}
