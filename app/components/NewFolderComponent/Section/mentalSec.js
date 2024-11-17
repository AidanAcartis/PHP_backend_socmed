import Card from "../../forPages/Cards";

export default function SectionMental() {
    return (
        <Card>
            <section className="bg-[#FFF8E8] my-8 p-6 rounded-lg shadow-lg max-h-[263px] overflow-y-auto">
    <h3 className="text-2xl mb-4 text-gray-800 font-semibold">Suivi de la santé mentale</h3>
    <div className="space-y-4">
        {/* Suivi des séances de thérapie */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🛋️ Suivi des séances de thérapie</p>
        </div>

        {/* Suivi de l'humeur */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🙂 Suivi de l'humeur</p>
        </div>

        {/* Suivi des objectifs */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🎯 Suivi des objectifs</p>
        </div>

        {/* Notifications de santé */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🔔 Notifications de santé</p>
        </div>

        {/* Évaluation de santé mentale */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🧠 Évaluation de santé mentale</p>
        </div>

        {/* Suivi des symptômes */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🤕 Suivi des symptômes</p>
        </div>
    </div>
</section>

        </Card>
    );
}
