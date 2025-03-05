'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from '@/app/services/Auth';

export default function AuthPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await loginUser(credentials);
      } else {
        await registerUser(credentials);
      }
      router.push("/");
    } catch {
      setError(
        isLogin
          ? "Email ou mot de passe incorrect"
          : "Erreur lors de l'inscription",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-500">
            WOW
            <br />
            CHARACTERS
            <br />
            TRACKER
          </h1>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-l-lg ${isLogin ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-400"}`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-r-lg ${!isLogin ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-400"}`}
            >
              Inscription
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-gray-400">
              Email
              <input
                type="email"
                name="email"
                placeholder="exemple@email.com"
                value={credentials.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </label>
          </div>

          <div className="form-group">
            <label className="block text-gray-400">
              Mot de passe
              <input
                type="password"
                name="password"
                placeholder="Votre mot de passe"
                value={credentials.password}
                onChange={handleChange}
                required
                minLength={8}
                className="mt-1 w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </label>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-busy={isLoading}
            disabled={isLoading}
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
      </div>
    </main>
  );
}