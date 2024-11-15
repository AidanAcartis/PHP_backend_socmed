import Card from "../../forPages/Cards";

// components/SupportSection.js
export default function SupportSection() {
    return (

    <Card>
            <section className="bg-[#FFF8E8] my-8 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-4 text-gray-800 font-semibold">Support et Assistance</h3>
              <p>❓ Besoin d'aide ? <a href="/chat" className="text-blue-600 hover:underline">🗨️  Chat en direct</a> ou <a href="/faq" className="text-blue-600 hover:underline"> 📚 FAQ</a></p>
            </section>
    </Card>
    );
  }