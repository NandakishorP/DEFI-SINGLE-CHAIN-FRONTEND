import Features from "@/components/Home/Featurs";
import Footer from "@/components/Home/Footer";
import Hero from "@/components/Home/Hero";
import MarketPreview from "@/components/Home/MarketPreview";
import Navbar from "@/components/Home/Navbar";
import Security from "@/components/Home/Security";
import Stats from "@/components/Home/Stats";
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <MarketPreview />
      <Security />
      <Footer />
    </div>
  );
}
