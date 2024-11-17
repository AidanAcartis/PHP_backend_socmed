export default function ContactSection() {
    return (
      <section id="contact" className="py-24 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Contactez-nous</h2>
          <p className="text-xl mb-8">Si vous avez des questions ou avez besoin d'aide, contactez-nous directement.</p>
          <form className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
            <input type="text" placeholder="Votre Nom" className="w-full p-3 mb-4 border rounded-md" />
            <input type="email" placeholder="Votre Email" className="w-full p-3 mb-4 border rounded-md" />
            <textarea placeholder="Votre Message" className="w-full p-3 mb-4 border rounded-md"></textarea>
            <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-blue-700">
              Envoyer
            </button>
          </form>
        </div>
      </section>
    );
  }
  