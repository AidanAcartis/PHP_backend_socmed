export default function MentalHealthSection() {
    return (
      <section id="mental" className="py-24 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Suivi Mental</h2>
          <p className="text-xl mb-8">Suivi des humeurs, de la santé mentale et des objectifs personnels. Accédez à des ressources adaptées à vos besoins.</p>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-medium">Suivi des Séances</h3>
              <p>Enregistrez vos sessions de thérapie et évaluez votre progrès au fil du temps.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-medium">Évaluations et Ressources</h3>
              <p>Complétez des tests d'évaluation de votre santé mentale et accédez à des articles, vidéos, et plus encore.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  