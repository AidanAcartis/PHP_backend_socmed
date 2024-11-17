import Link from "next/link";
import Header from "./components/NewFolderComponent/Accueil/headerPage";
import HeroSection from "./components/NewFolderComponent/Accueil/heroSection";
import MentalHealthSection from "./components/NewFolderComponent/Accueil/mentalHealthSectionPage";
import LegalSupportSection from "./components/NewFolderComponent/Accueil/legalSectionSection";
import ContactSection from "./components/NewFolderComponent/Accueil/contactSection";
import Footer from "./components/NewFolderComponent/Accueil/footerPage";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <Link href={'/home/mentalPage'}>
          <MentalHealthSection />
      </Link>
      <Link href={'/home/SuiviJuridique'}>
        <LegalSupportSection />
      </Link>
      <ContactSection />
      <Footer />
    </div>
  );
}
