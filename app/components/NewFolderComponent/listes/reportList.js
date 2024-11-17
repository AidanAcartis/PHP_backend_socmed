
export default function ReportList() {
    return (
        <div>
            <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-lg mt-2 w-64">
                <li className="hover:bg-indigo-100 p-2 rounded-md cursor-pointer">Soumettre un nouveau signalement</li>
                <li className="hover:bg-indigo-100 p-2 rounded-md cursor-pointer">Ajouter des preuves (captures, enregistrements)</li>
                <li className="hover:bg-indigo-100 p-2 rounded-md cursor-pointer">Contacter un conseiller juridique</li>
                <li className="hover:bg-indigo-100 p-2 rounded-md cursor-pointer">Consulter les notifications</li>
            </ul>
      </div>
    );
  }
  