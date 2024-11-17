export default function MentalHealthAssessments() {
    return (
        <div className="bg-gradient-to-r from-teal-300 to-blue-400 p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-8">
          <h4 className="text-2xl font-semibold text-white text-center">Test de dépression</h4>
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <p className="text-xl font-medium text-teal-700">Score: 7/10</p>
            <p className="mt-2 text-lg text-gray-600">Recommandations: Méditation quotidienne</p>
          </div>

          <div className="mt-4 bg-teal-100 p-4 rounded-lg shadow-sm">
            <p className="text-lg text-teal-800">Vous avez fait de bons progrès. Continuez à pratiquer la méditation et à suivre vos recommandations pour une amélioration continue.</p>
          </div>
        </div>
    );
  }
  