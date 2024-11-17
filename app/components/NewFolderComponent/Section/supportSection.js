import Link from "next/link";
import Card from "../../forPages/Cards";

// components/SupportSection.js
export default function SupportSection() {
    return (

    <Card>
            <section className="bg-[#FFF8E8] my-10 p-12 rounded-lg shadow-lg max-h-[263px] overflow-y-auto">
            <h3 className="text-2xl mb-4 text-gray-800 font-semibold">Support et Assistance</h3>
              <p>❓ Besoin d'aide ? 
                  <span className="text-blue-600 hover:underline">🗨️  Chat en direct</span>
                ou 
                  <span className="text-blue-600 hover:underline">📚 FAQ</span>
              </p>
            </section>
    </Card>
    );
  }