"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "../../forPages/Cards";
import SignalementBoard from "./signalementBoard";
import ChartSignalement from "../../../api/tools/tableauSignalement";
import Filters from "../dashboard/filters";
import ComplaintsBoard from "../dashboard/filtersSignalement";
import Statistiques from "../../../api/stats/statistiques";
import Dashboard from "../../../api/tools/dashboardForm";
import GeographicDistributionChart from "../SectionSecurity/secuGraph/geoGrap";
import ReportsByPersonChart from "../SectionSecurity/secuGraph/reportGraph";
import SignalementCharts from "../SectionSecurity/secuGraph/statusChart";
import StatutHistoryChart from "../SectionSecurity/secuGraph/evolutionChart";
import PrivateChat from "../../../api/chat/chatPrivate";
import ProofList from "../proof/secuProof";

export default function SecuFonctNavigationCard() {
  const pathname = usePathname();
  const activeElementClasses = 'text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 bg-[#FFF8E8] text-black md:-mx-8 px-6 md:px-8 rounded-md shadow-md shadow-gray-300 md:shadow-none';
  const nonActiveElementClasses = 'text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-[#FFF8E8] hover:bg-opacity-90 md:-mx-4 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300';

  const [activeTab, setActiveTab] = useState('dashboard');
  const Id = 1;

  useEffect(() => {
    const currentPath = pathname.split('/').pop(); 
    if (['manage', 'dashboard', 'proofAnalysis', 'comments', 'updateStatus', 'communication'].includes(currentPath)) {
      setActiveTab(currentPath);
    } else {
      setActiveTab('manage');
    } 
  }, [pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/home/fonctionnality/${tab}`);
  };

  return (
    <div className="md:flex md:flex-row">
      <div className="md:fixed md:w-[200px]">
        <Card noPadding={true}>
          <div className="px-9 py-2 flex justify-center md:block shadow-md shadow-gray-500">
            <h2 className="text-gray-400 mb-3 hidden md:block">Navigation</h2>
                <button onClick={() => handleTabChange('manage')} className={activeTab === 'manage' ? activeElementClasses : nonActiveElementClasses}>
                🛡️<span className="hidden md:block">Gérer les signalements</span>
                </button>
                <button onClick={() => handleTabChange('dashboard')} className={activeTab === 'dashboard' ? activeElementClasses : nonActiveElementClasses}>
                📊<span className="hidden md:block">Consulter le tableau de bord des cas</span>
                </button>

                <button onClick={() => handleTabChange('comments')} className={activeTab === 'comments' ? activeElementClasses : nonActiveElementClasses}>
                📝<span className="hidden md:block">Ajouter des commentaires ou des rapports</span>
                </button>

                <button onClick={() => handleTabChange('proofAnalysis')} className={activeTab === 'proofAnalysis' ? activeElementClasses : nonActiveElementClasses}>
                🔍<span className="hidden md:block">Analyser les preuves fournies</span>
                </button>

                <button onClick={() => handleTabChange('communication')} className={activeTab === 'communication' ? activeElementClasses : nonActiveElementClasses}>
                💬<span className="hidden md:block">Communiquer avec la victime</span>
                </button>
          </div>
        </Card>
      </div>

      <div className="md:ml-[220px] p-4">
        {activeTab === 'manage' && (
          <div>
            <p>Gérer les signalements</p>
            <SignalementBoard />
          </div>
        )}
        {activeTab === 'dashboard' && (
          <div>
            <p>Tableau de bord</p>
            <ComplaintsBoard />
            <Statistiques />
            <Dashboard />
            <GeographicDistributionChart />
            <ReportsByPersonChart />
            <SignalementCharts />
            <StatutHistoryChart signalementId={1}/>
          </div>
        )}
        {activeTab === 'proofAnalysis' && (
          <div>
            <p>Analyser les preuves fournies</p>
              <ProofList />
          </div>
        )}
        {activeTab === 'comments' && (
          <div>
            <p>Ajouter des commentaires ou des rapports</p>
            
          </div>
        )}
        {activeTab === 'updateStatus' && (
          <div>
                <p>Mettre à jour l'état des plaintes</p>
          </div>
        )}
        {activeTab === 'communication' && (
          <div>
                <p>Communiquer avec la victime</p>
                <Card>
                <div>
                    <PrivateChat />
                </div>
                </Card>
          </div>
        )}
      </div>
    </div>
  );
}
