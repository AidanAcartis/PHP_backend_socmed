// components/MainMenu.js
export default function MainMenu() {
    return (
      <nav className="bg-[#AAB396] p-4 flex justify-around">
        <a href="/" className="hover:text-blue-600">Accueil</a>
        <a href="/dashboard" className="hover:text-blue-600">Tableau de Bord</a>
        <a href="/reports" className="hover:text-blue-600">Mes Signalements</a>
        <a href="/resources" className="hover:text-blue-600">Centre de Ressources</a>
      </nav>
    );
}
