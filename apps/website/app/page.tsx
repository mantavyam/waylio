import HeroSection from "@/components/hero-section";
import Features from "@/components/features-4";
import FeaturesSection from "@/components/features-8";
import IntegrationsSection from "@/components/integrations-7";
import FAQsTwo from "@/components/faqs-2";
import ContactSection from "@/components/contact";
import FooterSection from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Features />
      <FeaturesSection />
      <IntegrationsSection />
      <FAQsTwo />
      <ContactSection />
      <FooterSection />
    </div>
  );
}
