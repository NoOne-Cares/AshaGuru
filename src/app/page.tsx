import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import StatsStrip from "@/components/landing/StatsStrip";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCases from "@/components/landing/UseCases";

import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";
console.log(process.env.GOOGLE_API_KEY);
export default function LandingPage() {
    return (
        <>
            <Nav />
            <main>
                <Hero />
                <StatsStrip />
                <Features />
                <HowItWorks />
                <UseCases />
                <CtaBanner />
            </main>
            <Footer />
        </>
    );
}

// import ChatContainer from "@/components/ChatContainer";

// export default function Home() {
//   return (
//     <main className="max-w-4xl mx-auto p-4">
//       <header className="text-center my-8">
//         <h1 className="text-4xl font-bold text-primary">ASHA Guru</h1>
//         <p className="text-gray-600 mt-2">Your AI-powered frontline health assistant</p>
//       </header>
//       <ChatContainer />
//     </main>
//   );
// }
