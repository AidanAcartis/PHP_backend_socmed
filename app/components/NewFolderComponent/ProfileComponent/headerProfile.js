// components/Header.js
export default function HeaderProfile() {
    return (
      <header className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-5">
        <div className="text-xl font-bold">Logo</div>
        <nav className="text-sm">
          <ul className="flex space-x-4">
            <li className="hover:text-gray-400">Profil</li>
            <li className="hover:text-gray-400">Historique</li>
            <li className="hover:text-gray-400">Graphiques</li>
            <li className="hover:text-gray-400">Ressources</li>
          </ul>
        </nav>
      </header>
    );
  }