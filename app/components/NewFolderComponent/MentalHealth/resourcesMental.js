export default function ResourcesMental() {
    return (
      <div className="bg-gradient-to-r from-purple-400 via-blue-300 to-teal-300 p-6 rounded-xl shadow-2xl max-w-lg mx-auto mt-8">
      <h2 className="text-3xl font-bold text-white text-center mb-6">Conseils et Ressources</h2>
      <div className="bg-white p-5 rounded-lg shadow-md space-y-3">
        <a 
          href="#" 
          className="block text-lg font-medium text-purple-600 hover:text-purple-800 transition-colors duration-300"
        >
          Vidéo: Gestion du stress
        </a>
        <a 
          href="#" 
          className="block text-lg font-medium text-purple-600 hover:text-purple-800 transition-colors duration-300"
        >
          Article: Techniques de relaxation
        </a>
        <p className="text-lg text-gray-700">Chatbot disponible pour des conseils immédiats</p>
      </div>
    </div>
    );
  }
  