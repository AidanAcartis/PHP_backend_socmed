// components/PlatformGuide.js
export default function PlatformGuide() {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">🌐 Guide d'utilisation de la plateforme</h2>
        <p className="mb-4">
          Cette plateforme connecte les femmes victimes de harcèlement ou de violence aux services de sécurité et organisations responsables, en offrant un environnement sécurisé pour gérer les plaintes et suivre leur traitement.
        </p>
        
        {/* Section pour les victimes */}
        <h3 className="text-xl font-bold mt-6 mb-3">👩‍💻 Pour les victimes</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Envoyer une plainte :</strong> Remplissez le formulaire dans la section <strong>"Signalement"</strong> :
            <ul className="list-disc pl-6 mt-2">
              <li>Renseignez votre nom complet, la date, l'heure et le lieu de l'incident.</li>
              <li>Localisez le lieu dans <strong>"Check in Google Maps"</strong>.</li>
              <li>Sélectionnez le service responsable le plus proche grâce à une recherche dans la base de données.</li>
              <li>Ajoutez des pièces jointes pertinentes.</li>
              <li>Cliquez sur <strong>"Soumettre"</strong> pour transmettre la plainte.</li>
            </ul>
          </li>
          <li>
            <strong>Suivi de l'enquête :</strong> Accédez à votre tableau de bord pour voir :
            <ul className="list-disc pl-6 mt-2">
              <li>Le statut actuel de votre enquête.</li>
              <li>Le service responsable de votre plainte.</li>
              <li>Les étapes suivantes et leur date prévue.</li>
              <li>La priorité de l'affaire (haute, moyenne, faible).</li>
              <li>Les dernières mises à jour et commentaires des services de sécurité.</li>
              <li>Une courbe représentant l'évolution de l'enquête.</li>
            </ul>
          </li>
          <li>
            <strong>Feedback :</strong> Fournissez vos retours sur le traitement de votre affaire via la section <strong>"Feedback"</strong>.
          </li>
          <li>
            <strong>Agenda :</strong> Planifiez vos événements ou rendez-vous liés à votre affaire.
          </li>
          <li>
            <strong>Forum et messagerie privée :</strong> Interagissez avec la communauté et communiquez directement avec les services responsables.
          </li>
          <li>
            <strong>Boîte à outils :</strong> Proposez des idées ou accédez à des ressources et aides supplémentaires.
          </li>
        </ul>
        
        {/* Section pour les services de sécurité */}
        <h3 className="text-xl font-bold mt-6 mb-3">🚨 Pour les services de sécurité</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Gestion des plaintes :</strong> Recevez les plaintes des victimes et examinez leurs détails (lieu, date, pièces jointes).
          </li>
          <li>
            <strong>Suivi des enquêtes :</strong> Informez les victimes des actions à venir et mettez à jour le statut des enquêtes.
          </li>
          <li>
            <strong>Statistiques :</strong> Accédez à des analyses des plaintes pour identifier les tendances ou les besoins spécifiques.
          </li>
          <li>
            <strong>Agenda :</strong> Utilisez l'outil d'agenda intégré pour planifier les événements liés aux enquêtes.
          </li>
        </ul>
  
        <h3 className="text-xl font-bold mt-6 mb-3">💡 Conseils pour une utilisation efficace</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Les victimes doivent s'assurer que les informations soumises sont complètes et exactes pour un traitement rapide.
          </li>
          <li>
            Les services de sécurité peuvent utiliser les statistiques pour améliorer leur réponse aux incidents.
          </li>
          <li>
            La communication régulière via le tableau de bord garantit une meilleure collaboration entre les victimes et les services.
          </li>
        </ul>
        
        <p className="mt-6">
          Cette plateforme vise à simplifier les interactions entre les victimes et les services de sécurité, tout en offrant des outils robustes pour la gestion des enquêtes et des ressources. En cas de problème, veuillez contacter notre support technique.
        </p>
      </div>
    );
  }
  