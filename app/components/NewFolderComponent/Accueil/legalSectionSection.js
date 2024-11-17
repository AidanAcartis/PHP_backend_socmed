export default function LegalSupportSection() {
    return (
      <section id="legal" className="py-24 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Suivi Juridique</h2>
          <p className="text-xl mb-8">Nous vous aidons à naviguer à travers les démarches juridiques et à protéger vos droits.</p>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-medium">Consultations Juridiques</h3>
              <p>Accédez à des consultations avec des avocats spécialisés dans les droits des femmes.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-medium">Guides et Assistance</h3>
              <p>Recevez des guides pratiques et des conseils sur les démarches juridiques.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  