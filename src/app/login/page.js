"use client"; // Indique que le code est côté client

import { useState } from 'react';
import { useAuth } from './actions'; // Importer le hook personnalisé

export default function LoginPage() {
  const { login, signup } = useAuth(); // Utiliser le hook personnalisé pour obtenir les méthodes
  const [formType, setFormType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // État pour le username
  const [error, setError] = useState(null); // État pour l'erreur

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null); // Réinitialiser l'erreur

    try {
      if (formType === 'login') {
        await login(email, password);
      } else {
        await signup(username, email, password); // Inclure le username lors du sign up
      }
    } catch (err) {
      setError(err.message); // Définir l'erreur si une exception est levée
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">{formType === 'login' ? 'Log in' : 'Sign up'}</h2>
        
        {error && <p className="text-red-500">{error}</p>} {/* Afficher l'erreur */}
        
        {formType === 'signup' && (
          <>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </>
        )}

        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-4">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setFormType('login')}
            className={`w-1/2 p-2 rounded-md ${formType === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setFormType('signup')}
            className={`w-1/2 p-2 rounded-md ${formType === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Sign up
          </button>
        </div>
        <button
          type="submit"
          className="mt-4 w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {formType === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>
    </div>
  );
}
