// components/MainMenu.js
import Link from 'next/link';

export default function MainMenu() {
    return (
      <nav className="bg-[#AAB396] p-4 flex justify-around">
        <Link href="/home/PageAccueil" className="hover:text-blue-600">Accueil</Link>
        <Link href="/home/profile" className="hover:text-blue-600">Profile</Link>
        <Link href="/reports" className="hover:text-blue-600">Mes Signalements</Link>
        <Link href="/resources" className="hover:text-blue-600">Centre de Ressources</Link>
      </nav>
    );
}
