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
        <Card>
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
