// components/Guide.js
export default function Guide() {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">📋 Guide pour soumettre un signalement</h2>
        <p>
          Bienvenue sur notre plateforme, qui connecte les femmes victimes de harcèlement, de violence, et autres abus, avec les services de sécurité et les organisations capables de leur venir en aide.
        </p>
        <p className="mt-3">
          Voici les étapes détaillées pour soumettre un signalement de manière simple et sécurisée :
        </p>
        <ul className="list-disc pl-5 mt-3">
          <li>Étape 1 : Identifiez le problème ou la situation à signaler.</li>
          <li>
            Étape 2 : Rassemblez toutes les informations nécessaires, comme :
            <ul className="list-disc pl-5 mt-2">
              <li>Votre nom complet</li>
              <li>La date, l'heure et le lieu de l'incident</li>
              <li>Des preuves supplémentaires, telles que des captures d'écran ou des descriptions précises</li>
            </ul>
          </li>
          <li>
            Étape 3 : Remplissez le formulaire dans la section <strong>"Signalement"</strong> :
            <ul className="list-disc pl-5 mt-2">
              <li>Ajoutez les détails de l'incident</li>
              <li>Utilisez l'option <strong>"Check in Google Maps"</strong> pour vérifier et préciser l'emplacement exact</li>
            </ul>
          </li>
          <li>
            Étape 4 : Recherchez le service le plus proche :
            <ul className="list-disc pl-5 mt-2">
              <li>Accédez à la section <strong>"Recherche"</strong> dans le formulaire</li>
              <li>Saisissez votre localisation pour trouver les services compétents à proximité</li>
              <li>Sélectionnez un service pour transmettre votre signalement</li>
            </ul>
          </li>
          <li>Étape 5 : Ajoutez les pièces jointes liées à l'incident, si nécessaire.</li>
          <li>Étape 6 : Cliquez sur le bouton <strong>"Soumettre"</strong> pour transmettre votre signalement.</li>
        </ul>
        <p className="mt-3">
          Une fois soumis, vous pourrez suivre l'état de votre signalement directement via notre plateforme.
        </p>
      </div>
    );
  }
  