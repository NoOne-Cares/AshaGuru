"use client";
import {
    ClockIcon,
    PlusCircleIcon,
    HomeIcon,
    UsersIcon,
} from "@/components/landing/Icons";
import { useReveal } from "@/app/hooks/useReveal";
import type { ReactNode } from "react";

const cases: { icon: ReactNode; title: string; body: string }[] = [
    {
        icon: <ClockIcon size={20} />,
        title: "Ante-natal care",
        body: "Track high-risk pregnancies, identify warning signs, and escalate appropriately. ASHA Guru guides you through every trimester check.",
    },
    {
        icon: <PlusCircleIcon size={20} />,
        title: "Child immunisation",
        body: "Check vaccine schedules, flag missed doses, and counsel parents — in the right language, with the right facts, every time.",
    },
    {
        icon: <HomeIcon size={20} />,
        title: "Home visits",
        body: "Look up protocols while at a patient's home. Record observations on the spot and generate visit summaries for your monthly log instantly.",
    },
    {
        icon: <UsersIcon size={20} />,
        title: "Community surveillance",
        body: "Report suspected outbreaks, receive real-time alerts for your area, and follow up with affected families with precise instructions.",
    },
];

export default function UseCases() {
    const headRef = useReveal();

    return (
        <section id="use-cases" className="bg-white py-24 px-8">
            <div className="max-w-[1100px] mx-auto">
                <div ref={headRef} className="reveal">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-teal-600 mb-3">
                        Use cases
                    </p>
                    <h2 className="font-serif text-[clamp(28px,4vw,42px)] leading-[1.12] text-ink-900">
                        Built for the realities
                        <br />
                        of frontline care
                    </h2>
                </div>

                <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cases.map((c, i) => (
                        <UseCard key={c.title} {...c} delay={i * 80} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function UseCard({
    icon,
    title,
    body,
    delay,
}: {
    icon: ReactNode;
    title: string;
    body: string;
    delay: number;
}) {
    const ref = useReveal();
    return (
        <div
            ref={ref}
            className="reveal flex gap-5 bg-sand-50 border border-sand-200 rounded-2xl p-8 hover:border-teal-100 transition-colors"
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="w-[42px] h-[42px] rounded-[10px] bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="font-serif text-[18px] text-ink-900 mb-1.5">
                    {title}
                </h3>
                <p className="text-[13px] leading-[1.65] text-ink-400">
                    {body}
                </p>
            </div>
        </div>
    );
}
