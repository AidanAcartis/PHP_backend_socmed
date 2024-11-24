'use client';
import { useState } from "react";

export default function Articles() {
  const articles = [
    { 
      title: "Les droits des femmes dans le monde", 
      link: "https://example.com/droits-des-femmes",
      content: "Cet article explore les droits fondamentaux des femmes à travers différents pays et propose des ressources pour en savoir plus."
    },
    { 
      title: "Comment signaler une situation de harcèlement ?", 
      link: "https://example.com/signaler-harcelement",
      content: "Découvrez les étapes pour signaler une situation de harcèlement, ainsi que les organismes pouvant vous soutenir."
    },
    { 
      title: "Lutter contre la violence domestique : ressources et soutien", 
      link: "https://example.com/violence-domestique",
      content: "Cet article fournit des informations pratiques pour lutter contre la violence domestique et accéder à des ressources d'aide."
    },
  ];

  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">📰 Articles sur les droits des femmes</h2>
      <ul className="list-disc pl-5 mt-3 space-y-2">
        {articles.map((article, index) => (
          <li key={index}>
            <button
              className="text-blue-400 hover:underline focus:outline-none"
              onClick={() => setSelectedArticle(article)}
            >
              {article.title}
            </button>
          </li>
        ))}
      </ul>
      
      {selectedArticle && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-xl font-bold mb-2">{selectedArticle.title}</h3>
          <p>{selectedArticle.content}</p>
          <a
            href={selectedArticle.link}
            className="text-blue-400 hover:underline mt-4 inline-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lire l'article complet
          </a>
        </div>
      )}
    </div>
  );
}
