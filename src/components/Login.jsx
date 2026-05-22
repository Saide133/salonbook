import { useState } from "react";
import { useClients } from "../context/ClientsContext";
import "./Login.css";

const USUARIOS = [
  { nombre: "Nadia", email: "nadia@nubys.com" },
  { nombre: "Silvana", email: "silvana@nubys.com" },
];

const Login = () => {
  const { login } = useClients();
  const [usuarioSel, setUsuarioSel] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuarioSel || !password) return;
    setLoading(true);
    setError("");
    try {
      await login(usuarioSel.email, password);
    } catch {
      setError("Contraseña incorrecta.");
    }
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">✿</div>
        <h1 className="login-title">Nubys Silva</h1>
        <p className="login-sub">Beauty Empire</p>

        <label className="login-label">Bienvenida ✿</label>
        <div className="login-usuarios">
          {USUARIOS.map((u) => (
            <button
              key={u.email}
              className={`login-usuario-btn ${usuarioSel?.email === u.email ? "selected" : ""}`}
              onClick={() => { setUsuarioSel(u); setError(""); }}
            >
              <div className="login-usuario-avatar">{u.nombre[0]}</div>
              <span className="login-usuario-nombre">{u.nombre}</span>
            </button>
          ))}
        </div>

        {usuarioSel && (
          <>
            <label className="login-label">Contraseña</label>
            <input
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoFocus
            />
            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Ingresando…" : "Ingresar"}
            </button>
          </>
        )}

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;