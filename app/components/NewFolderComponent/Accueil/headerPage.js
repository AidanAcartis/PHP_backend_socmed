export default function Header() {
    return (
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Plateforme de Suivi Mental et Juridique Féminin</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#mental" className="hover:underline">Suivi Mental</a></li>
              <li><a href="#legal" className="hover:underline">Suivi Juridique</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }
  