'use client';
// components/ResourcesSection.js
import { useEffect, useState } from 'react';

const ResourcesSection = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Animation pour "secouer" la section après le chargement de la page
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3">
      <section className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg mt-6 space-y-8">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center">
          📚 Section Ressources
        </h2>
        <p className="text-gray-600">
          Découvrez toutes les ressources disponibles pour vous aider à naviguer sur la plateforme.
        </p>

        {/* Grid Layout to display sections in 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Documentation Section */}
        <div className={`space-y-4 p-6 rounded-xl shadow-lg bg-blue-50 transition-all duration-300 ease-in-out ${animate ? 'animate-wiggle' : ''}`}>
          <h3 className="text-2xl font-semibold text-gray-700 flex items-center">
            📄 Documentation
          </h3>
          <ul className="space-y-2 text-lg">
            <li>📖 <a href="#" className="text-indigo-600 hover:text-indigo-800">Guide d'utilisation</a></li>
            <li>❓ <a href="#" className="text-indigo-600 hover:text-indigo-800">FAQ</a></li>
            <li>🎥 <a href="#" className="text-indigo-600 hover:text-indigo-800">Tutoriels Vidéo</a></li>
          </ul>
        </div>

        {/* Téléchargements Section */}
        <div className={`space-y-4 p-6 rounded-xl shadow-lg bg-green-50 transition-all duration-300 ease-in-out ${animate ? 'animate-wiggle' : ''}`}>
          <h3 className="text-2xl font-semibold text-gray-700 flex items-center">
            📥 Téléchargements
          </h3>
          <ul className="space-y-2 text-lg">
            <li>📝 <a href="#" className="text-indigo-600 hover:text-indigo-800">Modèles de Documents</a></li>
            <li>💻 <a href="#" className="text-indigo-600 hover:text-indigo-800">Logiciels et Outils</a></li>
            <li>📊 <a href="#" className="text-indigo-600 hover:text-indigo-800">Rapports et Études</a></li>
          </ul>
        </div>

        {/* Support Technique Section */}
        <div className={`space-y-4 p-6 rounded-xl shadow-lg bg-yellow-50 transition-all duration-300 ease-in-out ${animate ? 'animate-wiggle' : ''}`}>
          <h3 className="text-2xl font-semibold text-gray-700 flex items-center">
            🛠️ Support Technique
          </h3>
          <ul className="space-y-2 text-lg">
            <li>📧 <a href="#" className="text-indigo-600 hover:text-indigo-800">Contactez le support</a></li>
            <li>💬 <a href="#" className="text-indigo-600 hover:text-indigo-800">Forums et Discussions</a></li>
            <li>👩‍💻 <a href="#" className="text-indigo-600 hover:text-indigo-800">Assistance en Ligne</a></li>
          </ul>
        </div>

        {/* Politiques et Règlements Section */}
        <div className={`space-y-4 p-6 rounded-xl shadow-lg bg-purple-50 transition-all duration-300 ease-in-out ${animate ? 'animate-wiggle' : ''}`}>
          <h3 className="text-2xl font-semibold text-gray-700 flex items-center">
            ⚖️ Politiques et Règlements
          </h3>
          <ul className="space-y-2 text-lg">
            <li>📜 <a href="#" className="text-indigo-600 hover:text-indigo-800">Termes et Conditions</a></li>
            <li>🔒 <a href="#" className="text-indigo-600 hover:text-indigo-800">Politique de Confidentialité</a></li>
            <li>📝 <a href="#" className="text-indigo-600 hover:text-indigo-800">Charte Éthique</a></li>
          </ul>
        </div>

        {/* Liens Utiles Section */}
        <div className={`space-y-4 p-6 rounded-xl shadow-lg bg-teal-50 transition-all duration-300 ease-in-out ${animate ? 'animate-wiggle' : ''}`}>
          <h3 className="text-2xl font-semibold text-gray-700 flex items-center">
            🔗 Liens Utiles
          </h3>
          <ul className="space-y-2 text-lg">
            <li>🤝 <a href="#" className="text-indigo-600 hover:text-indigo-800">Partenaires et Collaborations</a></li>
            <li>🌐 <a href="#" className="text-indigo-600 hover:text-indigo-800">Ressources externes (ex. blogs)</a></li>
            <li>📚 <a href="#" className="text-indigo-600 hover:text-indigo-800">Documentation gouvernementale</a></li>
          </ul>
        </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesSection;
