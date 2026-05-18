"use client";
interface Props {
    onQuickAction: (phrase: string) => void;
}

export default function FeatureBar({ onQuickAction }: Props) {
    const features = [
        { label: "🩺 Clinical Support", phrase: "clinical" },
        { label: "🎭 Role-Play Training", phrase: "train me" },
        // { label: "📄 Generate Referral", phrase: "refer" },
        // { label: "📊 Monthly Report", phrase: "report" },
        // { label: "📢 Outbreak Check", phrase: "outbreak" },
    ];

    return (
        <div className="flex gap-2 flex-wrap p-2 border-b dark:border-ink-700">
            {features.map((f) => (
                <button
                    key={f.label}
                    onClick={() => onQuickAction(f.phrase)}
                    className="px-3 py-1 text-sm rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900 dark:text-teal-100 hover:bg-teal-100 dark:hover:bg-teal-800 transition"
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
}
// "use client";
// interface Props {
//     onQuickAction: (phrase: string) => void;
// }

// export default function FeatureBar({ onQuickAction }: Props) {
//     const features = [
//         { label: "🩺 Clinical Support", phrase: "clinical" },
//         { label: "🎭 Role-Play Training", phrase: "train me" },
//         { label: "📄 Generate Referral", phrase: "refer" },
//         { label: "📊 Monthly Report", phrase: "report" },
//         { label: "📢 Outbreak Check", phrase: "outbreak" },
//     ];

//     return (
//         <div className="flex gap-2 flex-wrap p-2 border-b dark:border-gray-700">
//             {features.map((f) => (
//                 <button
//                     key={f.label}
//                     onClick={() => onQuickAction(f.phrase)}
//                     className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300 hover:bg-primary/20 dark:hover:bg-primary/30 transition"
//                 >
//                     {f.label}
//                 </button>
//             ))}
//         </div>
//     );
// }
