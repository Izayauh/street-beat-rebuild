
import { useRef } from "react";
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import PromoPopup from '@/components/PromoPopup';

const Index = () => {
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero onBookStudioTime={scrollToContact} />
        <Services onGetQuote={scrollToContact} onScheduleConsultation={scrollToContact} />
        <div ref={contactRef}>
          <Contact />
        </div>
      </main>
      <Footer />
      <PromoPopup />
    </div>
  );
};

export default Index;
