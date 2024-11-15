import Card from "../../forPages/Cards";

// components/ResourceCenter.js
export default function ResourceCenter() {
    return (
      <Card>
            <section className="bg-[#FFF8E8] my-8 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-4 text-gray-800 font-semibold">Centre de Ressources</h3>
            <ul className="list-disc pl-6">
              <li>📋 Guide pour soumettre un signalement</li>
              <li>🌐 Articles sur la sécurité en ligne</li>
              <li> 🤝 Liens vers des organisations de soutien</li>
            </ul>
          </section>
      </Card>
    );
  }
  