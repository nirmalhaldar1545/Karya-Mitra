import { Navbar } from "~/components/navbar";
import { AuroraHero } from "~/components/ui/futuristic-hero-section";
import { FeaturesSection } from "~/components/features-section";
import { TeamSection } from "~/components/team-section";
import { Footer } from "~/components/footer";
import { ScrollToTop } from "~/components/scroll-to-top";
import { HashScroll } from "~/components/hash-scroll";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <HashScroll />
      <Navbar />
      <AuroraHero />
      <FeaturesSection />
      <TeamSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
