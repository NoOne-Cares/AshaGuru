import ChatContainer from "@/components/ChatContainer";

export default function AppPage() {
    return (
        <main className="min-h-screen bg-[var(--color-sand-50)]">
            <div className="max-w-[1100px] mx-auto px-4 py-6">
                {/* Header */}
                <header className="flex items-center justify-between mb-6">
                    <a href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-[8px] bg-[var(--color-teal-600)] flex items-center justify-center flex-shrink-0">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <span className="font-serif text-[18px] text-[var(--color-ink-900)] leading-none">
                            ASHA Guru
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-teal-400)] inline-block animate-pulse" />
                        <span className="text-[13px] text-[var(--color-ink-400)]">
                            Online
                        </span>
                    </div>
                </header>

                {/* Chat */}
                <ChatContainer />
            </div>
        </main>
    );
}
