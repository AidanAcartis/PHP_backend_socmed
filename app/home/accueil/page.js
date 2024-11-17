import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      <Head>
        <title>Signalez en toute sécurité</title>
      </Head>
      
      <header className="bg-blue-500 text-white py-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur la plateforme</h1>
          <p className="text-2xl">"Signalez en toute sécurité"</p>
        </div>
      </header>
      
      <nav className="my-10 flex justify-center gap-4">
        <button className="px-5 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition">Soumettre un Signalement</button>
        <button className="px-5 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition">Consulter le Tableau de Bord</button>
        <button className="px-5 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition">Ajouter des Preuves</button>
        <button className="px-5 py-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 transition">Consulter les Ressources</button>
      </nav>
      
      <section className="mx-auto max-w-5xl mb-10">
        <h2 className="text-2xl font-semibold mb-4">Aperçu des Statistiques</h2>
        <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg shadow-md bg-white">
          <div className="flex items-center justify-between">
            <span className="font-medium">🟢 Signalements résolus :</span>
            <span>128</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">🟡 En cours :</span>
            <span>45</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">🔵 Reçus :</span>
            <span>32</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">🟣 Transmis :</span>
            <span>15</span>
          </div>
        </div>
      </section>
      
      <section className="mx-auto max-w-5xl mb-10">
        <h2 className="text-2xl font-semibold mb-4">Centre de Ressources</h2>
        <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg shadow-md bg-white">
          <div className="flex items-center justify-between">
            <span className="font-medium">📚 Guide :</span>
            <a href="#" className="text-blue-500 hover:underline">"Comprendre vos Droits"</a>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">🔗 Liens utiles</span>
            <a href="#" className="text-blue-500 hover:underline">Consulter</a>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">📝 Articles récents</span>
            <a href="#" className="text-blue-500 hover:underline">Lire</a>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">☎️ Assistance directe</span>
            <a href="#" className="text-blue-500 hover:underline">Contact</a>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-100 py-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Support et Assistance</h2>
        <div className="flex justify-center gap-6">
          <a href="#" className="text-blue-500 hover:underline">💬 Chat en direct</a>
          <a href="#" className="text-blue-500 hover:underline">FAQ</a>
          <a href="#" className="text-blue-500 hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}
