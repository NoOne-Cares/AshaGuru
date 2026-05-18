import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "ASHA Guru — AI-powered frontline health assistant",
    description:
        "ASHA Guru puts a trained clinical advisor in your pocket — available in your language, anytime, anywhere.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}

// import "./globals.css";
// import { Toaster } from "react-hot-toast";

// export const metadata = {
//   title: "ASHA Guru",
//   description: "AI-powered health workforce companion",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
//         <Toaster position="top-center" />
//         {children}
//       </body>
//     </html>
//   );
// }
