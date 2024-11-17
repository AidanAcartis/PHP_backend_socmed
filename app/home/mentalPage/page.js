import Head from "next/head";
import DashboardForMental from "../../components/NewFolderComponent/MentalHealth/mentalDashboard";
import Dashboard from "../../components/NewFolderComponent/MentalHealth/mentalDashboard";

export default function MentalPage() {
  return (
    <div>
        <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Dancing+Script&display=swap" rel="stylesheet" />
    </Head>
    <div className="min-h-screen bg-gray-100 p-6">
      <DashboardForMental />
    </div>
    </div>
  );
}
