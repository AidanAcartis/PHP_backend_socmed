export default function MoodTracking() {
    return (
   
    <div className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 p-6 rounded-lg shadow-xl max-w-lg mx-auto mt-8">
      <h2 className="text-3xl font-semibold text-white text-center">Suivi des humeurs et émotions</h2>
      
      <textarea 
        className="w-full p-4 mt-4 text-gray-800 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 transition ease-in-out"
        placeholder="Enregistrez vos humeurs et émotions"
      ></textarea>
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <p className="text-lg font-medium text-orange-400">Graphique d'évolution des émotions au fil du temps</p>
        {/* Chart Component for mood tracking */}
        <div className="w-full h-48 mt-4 border-r-gray-700 bg-white rounded-lg">
          {/* Placeholder for the graph */}
        </div>
      </div>
    </div>
 
    );
  }
  