export default function GoalsTracking() {
    return (

        <div className="p-6 max-w-3xl mx-auto bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-600 rounded-xl shadow-2xl">
  <h2 className="text-3xl font-semibold text-white text-center">Mises à jour sur les objectifs de santé mentale</h2>
  
  <div className="mt-8 space-y-6">
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-medium text-purple-800">Objectif 1: Réduire le stress</h3>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-gray-700">Progression: 40%</span>
        <button className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-400 transition ease-in-out duration-300">
          Ajouter un rappel
        </button>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-pink-300 rounded-full">
          <div className="h-2 bg-pink-500 rounded-full" style={{ width: "40%" }}></div>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-medium text-purple-800">Objectif 2: Améliorer le sommeil</h3>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-gray-700">Progression: 60%</span>
        <button className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-400 transition ease-in-out duration-300">
          Ajouter un rappel
        </button>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-purple-300 rounded-full">
          <div className="h-2 bg-purple-500 rounded-full" style={{ width: "60%" }}></div>
        </div>
      </div>
    </div>
  </div>
</div>

    );
  }
  