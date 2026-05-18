"use client";
import { useState, useRef } from "react";

interface Props {
    onAudioReady: (base64: string) => void;
}

export default function AudioRecorder({ onAudioReady }: Props) {
    const [recording, setRecording] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(chunks.current, { type: "audio/wav" });
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = (reader.result as string).split(",")[1];
                    onAudioReady(base64);
                };
                reader.readAsDataURL(blob);
                chunks.current = [];
            };
            mediaRecorder.current.start();
            setRecording(true);
        } catch {
            alert("Microphone access is needed for voice input.");
        }
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
        setRecording(false);
    };

    return (
        <button
            onClick={recording ? stopRecording : startRecording}
            className={`p-2 rounded-full ${recording ? "bg-red-500 animate-pulse" : "bg-gray-200"}`}
        >
            {recording ? "⏹️" : "🎤"}
        </button>
    );
}