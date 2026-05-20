"use client";
import { Session } from "@/lib/storage";

interface Props {
    sessions: Session[];
    currentId: string;
    onSelect: (id: string) => void;
    onNew: () => void;
    onDelete: (id: string) => void;
}

export default function SessionSidebar({
    sessions,
    currentId,
    onSelect,
    onNew,
    onDelete,
}: Props) {
    return (
        <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col h-full">
            <button
                onClick={onNew}
                className="mb-4 px-4 py-2 bg-teal-700 text-white rounded-full hover:bg-teal-700 transition"
            >
                + New Patient
            </button>
            <div className="flex-1 overflow-y-auto space-y-2">
                {sessions.map((s) => (
                    <div
                        key={s.id}
                        onClick={() => onSelect(s.id)}
                        className={`p-2 rounded-lg cursor-pointer flex justify-between items-center ${
                            s.id === currentId
                                ? "bg-primary/20 dark:bg-primary/30"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                        <span className="truncate text-sm">{s.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(s.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-xs"
                        >
                            🗑
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
