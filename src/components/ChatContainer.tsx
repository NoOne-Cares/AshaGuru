"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import MessageBubble from "./MessageBubble";
import AudioRecorder from "./AudioRecorder";
import ImageUploader from "./ImageUploader";
import FeatureBar from "./FeatureBar";
import SessionSidebar from "./SessionSidebar";
import { toast } from "react-hot-toast";
import {
    getAllSessions,
    saveSession,
    deleteSession,
    Session,
} from "@/lib/storage";

const ASHA_ID = "ASHA001";

function generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export default function ChatContainer() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string>("");
    const [input, setInput] = useState("");
    const [audioData, setAudioData] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Derived messages – no extra state or effect needed
    const messages = useMemo(() => {
        const session = sessions.find((s) => s.id === currentSessionId);
        return session?.messages || [];
    }, [sessions, currentSessionId]);

    // Handlers defined before any effects that use them
    const updateSessionMessages = useCallback(
        (newMessages: { role: string; content: string }[]) => {
            setSessions((prev) => {
                const idx = prev.findIndex((s) => s.id === currentSessionId);
                if (idx < 0) return prev;
                const updated = [...prev];
                updated[idx] = {
                    ...updated[idx],
                    messages: newMessages,
                    lastUpdated: Date.now(),
                };
                return updated;
            });
        },
        [currentSessionId],
    );

    const handleNewSession = useCallback(() => {
        const newId = generateSessionId();
        const newSession: Session = {
            id: newId,
            name: `Patient ${new Date().toLocaleTimeString()}`,
            messages: [],
            lastUpdated: Date.now(),
        };
        setSessions((prev) => [...prev, newSession]);
        setCurrentSessionId(newId);
        saveSession(newSession);
    }, []);

    const handleSelectSession = useCallback((id: string) => {
        setCurrentSessionId(id);
    }, []);

    const handleDeleteSession = useCallback(
        async (id: string) => {
            await deleteSession(id);
            setSessions((prev) => {
                const updated = prev.filter((s) => s.id !== id);
                if (currentSessionId === id) {
                    if (updated.length > 0) {
                        setCurrentSessionId(updated[0].id);
                    } else {
                        // will trigger handleNewSession via effect below
                    }
                }
                return updated;
            });
        },
        [currentSessionId],
    );

    // Load sessions on mount – defined after handleNewSession
    useEffect(() => {
        getAllSessions().then((loaded) => {
            setSessions(loaded);
            if (loaded.length > 0) {
                setCurrentSessionId(loaded[0].id);
            } else {
                handleNewSession();
            }
        });
    }, [handleNewSession]);

    // Persist session when messages change
    useEffect(() => {
        const session = sessions.find((s) => s.id === currentSessionId);
        if (session) saveSession(session);
    }, [sessions, currentSessionId]);

    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() && !audioData && !imageData) return;
            const userMsg = {
                role: "user",
                content: text || "🎤 Voice / 📷 Image input",
            };
            const newMessages = [...messages, userMsg];
            updateSessionMessages(newMessages);
            setLoading(true);

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: newMessages,
                        audioData,
                        imageData,
                        ashaId: ASHA_ID,
                        sessionId: currentSessionId,
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    const assistantMsg = {
                        role: "assistant",
                        content: data.finalResponse,
                    };
                    updateSessionMessages([...newMessages, assistantMsg]);
                } else {
                    toast.error(data.error || "Something went wrong");
                }
            } catch {
                toast.error("Network error.");
            }
            setLoading(false);
            setInput("");
            setAudioData(null);
            setImageData(null);
        },
        [
            messages,
            audioData,
            imageData,
            currentSessionId,
            updateSessionMessages,
        ],
    );

    const handleAudioReady = (base64: string) => {
        setAudioData(base64);
        sendMessage("");
    };
    const handleImageReady = (base64: string) => {
        setImageData(base64);
        sendMessage("");
    };

    return (
        <div className="flex h-[85vh] bg-white dark:bg-ink-900 rounded-3xl shadow-xl overflow-hidden transition-colors">
            <SessionSidebar
                sessions={sessions}
                currentId={currentSessionId}
                onSelect={handleSelectSession}
                onNew={handleNewSession}
                onDelete={handleDeleteSession}
            />
            <div className="flex-1 flex flex-col">
                <FeatureBar onQuickAction={(phrase) => sendMessage(phrase)} />
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <MessageBubble
                            key={idx}
                            role={msg.role}
                            content={msg.content}
                        />
                    ))}
                    {loading && (
                        <div className="text-center text-ink-400 animate-pulse">
                            ASHA Guru is thinking...
                        </div>
                    )}
                </div>
                <div className="border-t dark:border-ink-700 p-4 flex items-center gap-3">
                    <AudioRecorder onAudioReady={handleAudioReady} />
                    <ImageUploader onImageReady={handleImageReady} />
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && sendMessage(input)
                        }
                        placeholder="Type your message..."
                        className="flex-1 rounded-full px-4 py-2 border dark:border-ink-400 bg-white dark:bg-ink-700 text-ink-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={loading}
                        className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-800 disabled:opacity-50 transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
// "use client";
// import { useState, useEffect, useCallback, useMemo } from "react";
// import MessageBubble from "./MessageBubble";
// import AudioRecorder from "./AudioRecorder";
// import ImageUploader from "./ImageUploader";
// import FeatureBar from "./FeatureBar";
// import SessionSidebar from "./SessionSidebar";
// import { toast } from "react-hot-toast";
// import {
//     getAllSessions,
//     saveSession,
//     deleteSession,
//     Session,
// } from "@/lib/storage";

// const ASHA_ID = "ASHA001";

// function generateSessionId() {
//     return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
// }

// export default function ChatContainer() {
//     const [sessions, setSessions] = useState<Session[]>([]);
//     const [currentSessionId, setCurrentSessionId] = useState<string>("");
//     const [input, setInput] = useState("");
//     const [audioData, setAudioData] = useState<string | null>(null);
//     const [imageData, setImageData] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);

//     // Derived messages – no extra state or effect needed
//     const messages = useMemo(() => {
//         const session = sessions.find((s) => s.id === currentSessionId);
//         return session?.messages || [];
//     }, [sessions, currentSessionId]);

//     // Handlers defined before any effects that use them
//     const updateSessionMessages = useCallback(
//         (newMessages: { role: string; content: string }[]) => {
//             setSessions((prev) => {
//                 const idx = prev.findIndex((s) => s.id === currentSessionId);
//                 if (idx < 0) return prev;
//                 const updated = [...prev];
//                 updated[idx] = {
//                     ...updated[idx],
//                     messages: newMessages,
//                     lastUpdated: Date.now(),
//                 };
//                 return updated;
//             });
//         },
//         [currentSessionId],
//     );

//     const handleNewSession = useCallback(() => {
//         const newId = generateSessionId();
//         const newSession: Session = {
//             id: newId,
//             name: `Patient ${new Date().toLocaleTimeString()}`,
//             messages: [],
//             lastUpdated: Date.now(),
//         };
//         setSessions((prev) => [...prev, newSession]);
//         setCurrentSessionId(newId);
//         saveSession(newSession);
//     }, []);

//     const handleSelectSession = useCallback((id: string) => {
//         setCurrentSessionId(id);
//     }, []);

//     const handleDeleteSession = useCallback(
//         async (id: string) => {
//             await deleteSession(id);
//             setSessions((prev) => {
//                 const updated = prev.filter((s) => s.id !== id);
//                 if (currentSessionId === id) {
//                     if (updated.length > 0) {
//                         setCurrentSessionId(updated[0].id);
//                     } else {
//                         // will trigger handleNewSession via effect below
//                     }
//                 }
//                 return updated;
//             });
//         },
//         [currentSessionId],
//     );

//     // Load sessions on mount – defined after handleNewSession
//     useEffect(() => {
//         getAllSessions().then((loaded) => {
//             setSessions(loaded);
//             if (loaded.length > 0) {
//                 setCurrentSessionId(loaded[0].id);
//             } else {
//                 handleNewSession();
//             }
//         });
//     }, [handleNewSession]);

//     // Persist session when messages change
//     useEffect(() => {
//         const session = sessions.find((s) => s.id === currentSessionId);
//         if (session) saveSession(session);
//     }, [sessions, currentSessionId]);

//     const sendMessage = useCallback(
//         async (text: string) => {
//             if (!text.trim() && !audioData && !imageData) return;
//             const userMsg = {
//                 role: "user",
//                 content: text || "🎤 Voice / 📷 Image input",
//             };
//             const newMessages = [...messages, userMsg];
//             updateSessionMessages(newMessages);
//             setLoading(true);

//             try {
//                 const res = await fetch("/api/chat", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         messages: newMessages,
//                         audioData,
//                         imageData,
//                         ashaId: ASHA_ID,
//                         sessionId: currentSessionId,
//                     }),
//                 });
//                 const data = await res.json();
//                 if (data.success) {
//                     const assistantMsg = {
//                         role: "assistant",
//                         content: data.finalResponse,
//                     };
//                     updateSessionMessages([...newMessages, assistantMsg]);
//                 } else {
//                     toast.error(data.error || "Something went wrong");
//                 }
//             } catch {
//                 toast.error("Network error.");
//             }
//             setLoading(false);
//             setInput("");
//             setAudioData(null);
//             setImageData(null);
//         },
//         [
//             messages,
//             audioData,
//             imageData,
//             currentSessionId,
//             updateSessionMessages,
//         ],
//     );

//     const handleAudioReady = (base64: string) => {
//         setAudioData(base64);
//         sendMessage("");
//     };
//     const handleImageReady = (base64: string) => {
//         setImageData(base64);
//         sendMessage("");
//     };

//     return (
//         <div className="flex h-[85vh] bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden transition-colors">
//             <SessionSidebar
//                 sessions={sessions}
//                 currentId={currentSessionId}
//                 onSelect={handleSelectSession}
//                 onNew={handleNewSession}
//                 onDelete={handleDeleteSession}
//             />
//             <div className="flex-1 flex flex-col">
//                 <FeatureBar onQuickAction={(phrase) => sendMessage(phrase)} />
//                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                     {messages.map((msg, idx) => (
//                         <MessageBubble
//                             key={idx}
//                             role={msg.role}
//                             content={msg.content}
//                         />
//                     ))}
//                     {loading && (
//                         <div className="text-center text-gray-400 animate-pulse">
//                             ASHA Guru is thinking...
//                         </div>
//                     )}
//                 </div>
//                 <div className="border-t dark:border-gray-700 p-4 flex items-center gap-3">
//                     <AudioRecorder onAudioReady={handleAudioReady} />
//                     <ImageUploader onImageReady={handleImageReady} />
//                     <input
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={(e) =>
//                             e.key === "Enter" && sendMessage(input)
//                         }
//                         placeholder="Type your message..."
//                         className="flex-1 rounded-full px-4 py-2 border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
//                     />
//                     <button
//                         onClick={() => sendMessage(input)}
//                         disabled={loading}
//                         className="bg-primary text-white px-6 py-2 rounded-full hover:bg-teal-700 disabled:opacity-50 transition"
//                     >
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
