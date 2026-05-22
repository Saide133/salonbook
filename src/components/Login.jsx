import { useState } from "react";
import { useClients } from "../context/ClientsContext";
import "./Login.css";

const Login = () => {
  const { login } = useClients();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Email o contraseña incorrectos.");
    }
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">✿</div>
        <h1 className="login-title">Nubys Silva</h1>
        <p className="login-sub">Beauty Empire</p>

        <label className="login-label">Email</label>
        <input className="login-input" type="email" placeholder="tu@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()} />

        <label className="login-label">Contraseña</label>
        <input className="login-input" type="password" placeholder="••••••••"
          value={password} onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()} />

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Ingresando…" : "Ingresar"}
        </button>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;