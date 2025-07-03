import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import VideoDemoSection from "@/components/sections/video-demo-section";
import FeaturesSection from "@/components/sections/features-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import JoinSection from "@/components/sections/join-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <VideoDemoSection />
        <FeaturesSection />
        <TestimonialsSection />
        <JoinSection />
      </main>
      <Footer />
    </div>
  );
}
