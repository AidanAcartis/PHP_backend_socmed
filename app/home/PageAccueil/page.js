import Link from "next/link";
import ContactSection from "../../components/NewFolderComponent/Accueil/contactSection";
import Footer from "../../components/NewFolderComponent/Accueil/footerPage";
import HeroSection from "../../components/NewFolderComponent/Accueil/heroSection";
import LegalSupportSection from "../../components/NewFolderComponent/Accueil/legalSectionSection";
import MentalHealthSection from "../../components/NewFolderComponent/Accueil/mentalHealthSectionPage";
import Header from "../../components/NewFolderComponent/header";


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
