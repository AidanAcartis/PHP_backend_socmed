export default function Organizations() {
    const organizations = [
      { 
        name: "Centre d'Écoute et de Conseil Juridique - CECJ", 
        link: "https://www.cecj-madagascar.org", 
        description: "Offre une assistance juridique et psychologique aux femmes victimes de violences à Madagascar." 
      },
      { 
        name: "Platforme de Lutte Contre les Violences Basées sur le Genre - PLVBG", 
        link: "https://www.plvbg-madagascar.org", 
        description: "Coordonne les efforts de lutte contre les violences basées sur le genre dans le pays." 
      },
      { 
        name: "Fédération pour la Promotion Féminine et Enfantine à Madagascar", 
        link: "https://www.fpfem-madagascar.org", 
        description: "Travaille à promouvoir les droits des femmes et des enfants à Madagascar." 
      },
      { 
        name: "Sehatra Iombonana ho an'ny Vehivavy", 
        link: "https://www.sehatra-madagascar.org", 
        description: "Regroupe des associations malgaches pour la promotion des droits des femmes." 
      },
      { 
        name: "UNICEF Madagascar", 
        link: "https://www.unicef.org/madagascar", 
        description: "Soutient les programmes en faveur des droits des femmes et des enfants, y compris contre les violences." 
      },
    ];
  
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">🤝 Organisations et services à Madagascar</h2>
        <p className="mb-4">Voici des organisations locales et internationales qui soutiennent les femmes victimes de violences à Madagascar.</p>
        <ul className="list-disc pl-5 mt-3 space-y-4">
          {organizations.map((org, index) => (
            <li key={index}>
              <div>
                <a 
                  href={org.link} 
                  className="text-blue-400 hover:underline font-bold" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {org.name}
                </a>
                <p className="text-sm text-gray-300">{org.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  