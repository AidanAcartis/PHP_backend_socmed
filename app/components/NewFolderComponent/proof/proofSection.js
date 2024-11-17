// components/ProofSection.js

const ProofSection = () => {
    return (
      <section className="bg-white p-8 rounded-lg shadow-xl mt-8 space-y-8">
        {/* Titre principal */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Preuves pour la plainte</h2>
          <p className="text-lg text-gray-600">Veuillez télécharger les preuves pertinentes pour votre plainte. Vous pouvez télécharger plusieurs fichiers.</p>
        </div>
  
        {/* Zone de téléchargement de fichiers */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Ajouter des preuves</label>
          <div className="mt-3">
            <input
              type="file"
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              multiple
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Acceptez les fichiers PDF, images (JPG, PNG) et d'autres formats pris en charge.</p>
        </div>
  
        {/* Liste des fichiers téléchargés */}
        <div className="mt-2 block w-full bg-gray-50 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
          <h3 className="text-xl font-semibold text-gray-800">Fichiers téléchargés</h3>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition duration-300">
              <span className="text-gray-700">preuve1.pdf</span>
              <button className="text-sm text-red-500 hover:text-red-700 transition duration-200">Supprimer</button>
            </li>
            <li className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition duration-300">
              <span className="text-gray-700">photo_preuve.png</span>
              <button className="text-sm text-red-500 hover:text-red-700 transition duration-200">Supprimer</button>
            </li>
          </ul>
        </div>
  
      </section>
    );
  };
  
  export default ProofSection;
  