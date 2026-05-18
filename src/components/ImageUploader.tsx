"use client";
interface Props {
    onImageReady: (base64: string) => void;
}

export default function ImageUploader({ onImageReady }: Props) {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(",")[1];
            onImageReady(base64);
        };
        reader.readAsDataURL(file);
    };

    return (
        <label className="cursor-pointer p-2 bg-gray-200 rounded-full">
            📷
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" capture="environment" />
        </label>
    );
}