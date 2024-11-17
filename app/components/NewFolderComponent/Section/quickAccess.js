import Card from "../../forPages/Cards";

export default function QuickAccess() {
    return (
        <Card>
            <section className="bg-[#FFF8E8] my-8 p-6 rounded-lg shadow-lg max-h-[263px] overflow-y-auto">
                <h3 className="text-2xl mb-4 text-gray-800 font-semibold">Suivi Juridique</h3>
                <div className="space-y-4">
                    {/* Soumettre un signalement */}
                    <div className="flex items-center gap-4">
                        <p className="text-gray-800">🚨 Soumettre un signalement</p>
                    </div>
                    
                    {/* Consulter le tableau de bord */}
                    <div className="flex items-center gap-4">
                        <p className="text-gray-800"> 📊 Consulter le tableau de bord</p>
                    </div>
                    
                    {/* Ajouter des preuves */}
                    <div className="flex items-center gap-4">
                        <p className="text-gray-800">🧾 Ajouter des preuves</p>
                    </div>
                    
                    {/* Consulter les ressources */}
                    <div className="flex items-center gap-4">
                        <p className="text-gray-800">🏢 Consulter les ressources</p>
                    </div>
                </div>
            </section>
        </Card>
    );
}
