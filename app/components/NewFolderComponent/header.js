// components/Header.js
import Link from 'next/link';

export default function Header() {
    return (
      <header className="bg-white text-black p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tech'her</h1>
        <div className="flex items-center gap-2">
        <Link href="/home/PageAccueil" className="bg-white p-2 rounded text-black hover:text-blue-600">Accueil</Link>
        <Link href="/home/profile" className="bg-white p-2 rounded text-black hover:text-blue-600">Profile</Link>
        <Link href="/home/PageAccueil" className="bg-white p-2 rounded text-black hover:text-blue-600">Aide</Link>
        <Link href="/home/patientProfile" className="bg-white p-2 rounded text-black hover:text-blue-600">Contacts</Link>
        <Link href="/home/PageAccueil" className="bg-white p-2 rounded text-black hover:text-blue-600">Log in</Link>
        <Link href="/home/patientProfile" className="bg-white p-2 rounded text-black hover:text-blue-600">Log out</Link>
        </div>
      </header>
    );
}
