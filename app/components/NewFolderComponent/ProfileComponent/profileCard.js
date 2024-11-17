// components/UserProfileCard.js
export default function UserProfileCard() {
    return (
      <section className="flex items-center bg-gray-800 p-4 rounded-lg mb-5">
        <img src="/profile.jpg" alt="User Profile" className="rounded-full w-20 h-20 mr-4 shadow-lg" />
        <div className="text-sm">
          <h2 className="text-lg font-semibold">Nom : John Doe</h2>
          <p className="text-gray-400">Date d'inscription : 01/01/2024</p>
          <p className="text-gray-400">Dernière interaction : 15/11/2024</p>
        </div>
      </section>
    );
  }
  