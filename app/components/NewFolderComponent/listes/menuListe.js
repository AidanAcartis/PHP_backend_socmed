
export default function MenuList() {
  return (
      <div>
          <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-lg mt-2 w-64">
            <li className="hover:bg-indigo-100 p-2 rounded-md cursor-pointer">Tableau de bord</li>
            <li className="hover:bg-indigo-100 p-2 rounded-md cursor-pointer">Soumettre un signalement</li>
            <li className="hover:bg-indigo-100 p-2 rounded-md cursor-pointer">Mes signalements</li>
            <li className="hover:bg-indigo-100 p-2 rounded-md cursor-pointer">Centre de ressources</li>
            <li className="hover:bg-indigo-100 p-2 rounded-md cursor-pointer">Support et assistance</li>
          </ul>
    </div>
  );
}
