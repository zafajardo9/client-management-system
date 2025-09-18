import { HeroSection, FeaturesSection, CTASection, Footer } from "@/components/pages/landing-page";

export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24 space-y-16">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
