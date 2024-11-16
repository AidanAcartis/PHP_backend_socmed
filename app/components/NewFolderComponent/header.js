// components/Header.js
import Link from 'next/link';

export default function Header() {
    return (
      <header className="bg-[#674636] text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plateforme de Signalement</h1>
        <nav className="flex gap-4">
          <Link href="/" className="hover:underline">Accueil</Link>
          <Link href="/dashboard" className="hover:underline">Tableau de Bord</Link>
          <Link href="/reports" className="hover:underline">Mes Signalements</Link>
          <Link href="/resources" className="hover:underline">Centre de Ressources</Link>
        </nav>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Recherche..." className="p-2 rounded" />
          <button className="bg-[#674636] p-2 rounded text-white">Profil</button>
        </div>
      </header>
    );
}
