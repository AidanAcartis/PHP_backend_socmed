export default function NotificationsHealth() {
    return (
      <div className="bg-gradient-to-r from-green-400 via-blue-400 to-teal-400 p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">Notifications Médicales</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-lg font-medium text-gray-800">
          <p className="mb-4 text-xl text-green-600">Rappel pour prendre des médicaments : <span className="font-bold text-xl">14h00</span></p>
          <p className="text-xl text-blue-600">Prochaine consultation : <span className="font-bold text-xl">18/11/2024</span></p>
        </div>
      </div>
    </div>
    );
  }
  