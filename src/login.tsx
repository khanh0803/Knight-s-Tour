// Login.tsx
import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from 'firebase/auth';

type LoginProps = {
  onLogin: (user: User) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      let userCredential;
      if (isRegister) {
        // Sign up
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign in
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(userCredential.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">{isRegister ? "Sign up" : "Sign in"}</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-2 py-1 rounded"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-2 py-1 rounded"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isRegister ? "Sign up" : "Sign in"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegister((prev) => !prev)}
            className="text-blue-500 hover:underline"
          >
            {isRegister ? "Already have an account? Sign in" : "Don't have an account yet? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
