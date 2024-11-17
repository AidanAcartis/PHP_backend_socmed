import Header from "../header";
import GoalsTracking from "./goalsTrack";
import MentalHealthAssessments from "./mentalHealthAssessment";
import MoodTracking from "./moodTrack";
import NotificationsHealth from "./notificationHealth";
import ResourcesMental from "./resourcesMental";
import SessionTracking from "./sessionTrack";
import SymptomsTracking from "./symptomTrack";


export default function DashboardForMental() {
  return (
    <div className="p-8 bg-white text-black space-y-12">
      <Header />
      <div className="bg-[#F7EED3] p-10 text-center">
        <h2 className="text-3xl font-semibold text-black">Bienvenue dans la section de suivi mentale</h2>
      </div>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">
  <div className="bg-white text-gray-800 p-2 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300">
  <h3 className="text-xl font-semibold text-center mb-4">Suivi des Séances</h3>
  <SessionTracking />
</div>

<div className="bg-white text-gray-800 p-4 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300">
  <h3 className="text-xl font-semibold text-center mb-4">Suivi de l'Humeur</h3>
  <MoodTracking />
</div>

<div className="bg-white text-gray-800 p-4 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300">
  <h3 className="text-xl font-semibold text-center mb-4">Suivi des Objectifs</h3>
  <GoalsTracking />
</div>

<div className="bg-white text-gray-800 p-4 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300">
  <h3 className="text-xl font-semibold text-center mb-4">Notifications de Santé</h3>
  <NotificationsHealth />
</div>

<div className="bg-white text-gray-800 p-4 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300">
  <h3 className="text-xl font-semibold text-center mb-4">Évaluations de Santé Mentale</h3>
  <MentalHealthAssessments />
</div>

<div className="bg-white text-gray-800 p-4 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300">
  <h3 className="text-xl font-semibold text-center mb-4">Suivi des Symptômes</h3>
  <SymptomsTracking />
</div>

<div className="bg-white text-gray-800 p-4 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300">
  <h3 className="text-xl font-semibold text-center mb-4">Ressources de Santé Mentale</h3>
  <ResourcesMental />
</div>

  </div>
</div>

  );
}
