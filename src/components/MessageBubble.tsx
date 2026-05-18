export default function MessageBubble({ role, content }: { role: string; content: string }) {
    const isUser = role === "user";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[70%] p-3 rounded-2xl ${isUser ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
                    }`}
            >
                <p className="whitespace-pre-wrap">{content}</p>
            </div>
        </div>
    );
}