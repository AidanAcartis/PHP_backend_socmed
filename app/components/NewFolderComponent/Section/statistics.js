import Card from "../../forPages/Cards";

// components/Statistics.js
export default function Statistics() {
    return (
    <Card>
           <section className="bg-[#FFF8E8] my-8 p-6 rounded-lg shadow-lg max-h-[263px] overflow-y-auto">
           <h3 className="text-2xl mb-4 text-gray-800 font-semibold">Aperçu des Statistiques</h3>
            <p>⏳ Nombre de signalements en cours : 10</p>
            <p> ✅ Nombre de signalements résolus : 5</p>
            <p> 🗂️ Nombre total de signalements : 15</p>
          </section>
    </Card>
    );
  }