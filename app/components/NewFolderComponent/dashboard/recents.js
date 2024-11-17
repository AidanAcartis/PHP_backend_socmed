export default function RecentForm() {
    return (
            <div>
                {/* Actions Récentes */}
                <section className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                    <span className="bg-gray-200"><span>📝</span>Actions Récentes</span>
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-lg mt-4 border-l-4 border-green-600">
                    <ul className="space-y-4">
                    <li className="flex items-center space-x-2">
                        <span className="text-green-600">🟢</span>
                        <span className="text-gray-700">15/11/24 - Ajout de notes pour "Harcèlement verbal" (Responsable: Jean Dupont)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span className="text-yellow-600">🟡</span>
                        <span className="text-gray-700">14/11/24 - Vérification d'un complément demandé (Responsable: Marie Lemoine)</span>
                    </li>
                    </ul>
                </div>
                </section>

            </div>
    );
}