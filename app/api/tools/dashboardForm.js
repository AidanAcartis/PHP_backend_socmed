// components/Dashboard.js

import Card from "../../components/forPages/Cards";
import CommentForm from "../../components/NewFolderComponent/dashboard/commentForm";
import Filters from "../../components/NewFolderComponent/dashboard/filters";
import IncidentTable from "../../components/NewFolderComponent/dashboard/incidentTable";
import RecentForm from "../../components/NewFolderComponent/dashboard/recents";
import StatsForm from "../../components/NewFolderComponent/dashboard/stats";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Tableau de Bord</h1>
          <div className="flex space-x-4">
            <button className="bg-blue-300 text-white px-4 py-2 rounded">☰ Menu</button>
            <button className="bg-gray-300 text-white px-4 py-2 rounded">⚙️ Paramètres</button>
            <button className="bg-red-300 text-white px-4 py-2 rounded">🔔 Notifications</button>
          </div>
        </header>
        <Card>
            {/* Filtres */}
            <Filters />
            {/* Tableau des signalements */}
            
        </Card>
        <Card>
            <div>
                <StatsForm />
            </div>
            <div>
                <RecentForm />
            </div>
            <div>
                <CommentForm />
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
