import { useState } from "react";
import { useClients } from "../context/ClientsContext";
import Header from "./Header";
import NewClientForm from "./NewClientForm";
import ClientPanel from "./ClientPanel";
import "./Home.css";
import { Cake, Search, Plus, LayoutGrid, List } from "lucide-react";

const isBirthdaySoon = (ds) => {
  if (!ds) return false;
  const today = new Date();
  const b = new Date(ds + "T12:00:00");
  const next = new Date(today.getFullYear(), b.getMonth(), b.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return (next - today) / (1000 * 60 * 60 * 24) <= 7;
};

const getUltimaVisita = (historial) => {
  if (!historial || historial.length === 0) return null;
  const sorted = [...historial].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const fecha = new Date(sorted[0].fecha + "T12:00:00");
  const hoy = new Date();
  const dias = Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24));
  if (dias === 0) return "hoy";
  if (dias === 1) return "ayer";
  if (dias < 7) return `hace ${dias} días`;
  if (dias < 30) return `hace ${Math.floor(dias / 7)} sem.`;
  if (dias < 365) return `hace ${Math.floor(dias / 30)} meses`;
  return `hace +1 año`;
};

const Home = () => {
  const { clients, loadingClients } = useClients();
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [orden, setOrden] = useState("nombre");
  const [vista, setVista] = useState("grilla");

  const filtered = clients
    .filter(
      (c) =>
        c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        c.telefono?.includes(search)
    )
    .sort((a, b) => {
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (orden === "recientes") {
        const aFecha = a.historial?.length > 0
          ? Math.max(...a.historial.map(h => new Date(h.fecha)))
          : new Date(a.creadoEn);
        const bFecha = b.historial?.length > 0
          ? Math.max(...b.historial.map(h => new Date(h.fecha)))
          : new Date(b.creadoEn);
        return bFecha - aFecha;
      }
      return 0;
    });

  return (
    <div className="home-wrap">
      <Header />
      <main className="home-main">

        {clients.some(c => isBirthdaySoon(c.cumpleanos)) && (
          <div className="home-bday-banner">
            <Cake size={20} color="#c9a96e" />
            <span className="home-bday-text">
              Cumpleaños esta semana:{" "}
              {clients
                .filter(c => isBirthdaySoon(c.cumpleanos))
                .map((c, i, arr) => (
                  <span key={c.id}>
                    <span className="home-bday-name">{c.nombre.split(" ")[0]}</span>
                    {i < arr.length - 1 ? ", " : ""}
                  </span>
                ))
              }
            </span>
          </div>
        )}

        <div className="home-topbar">
          <h2 className="home-title">
            Clientas <span className="home-count">({filtered.length})</span>
          </h2>
          <div className="home-search-wrap">
            <Search size={15} className="home-search-icon" />
            <input
              className="home-search"
              placeholder="Buscar por nombre o teléfono…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="home-vista-toggle">
            <button
              className={`home-vista-btn ${vista === "grilla" ? "active" : ""}`}
              onClick={() => setVista("grilla")}
              title="Vista grilla"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`home-vista-btn ${vista === "lista" ? "active" : ""}`}
              onClick={() => setVista("lista")}
              title="Vista lista"
            >
              <List size={16} />
            </button>
          </div>
          <select
            className="home-orden"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="nombre">A → Z</option>
            <option value="recientes">Más recientes</option>
          </select>
          <button className="home-btn-new" onClick={() => setShowNew(true)}>
            <Plus size={15} />
            Nueva clienta
          </button>
        </div>

        {loadingClients ? (
          <p className="home-loading">Cargando clientas…</p>
        ) : filtered.length === 0 ? (
          <div className="home-empty">
            <p className="home-empty-icon">✿</p>
            <p className="home-empty-title">
              {search ? "Sin resultados" : "Todavía no hay clientas"}
            </p>
            <p className="home-empty-sub">
              {search
                ? "Probá con otro término."
                : "Creá la primera ficha con el botón de arriba."}
            </p>
          </div>
        ) : vista === "grilla" ? (
          <div className="home-grid">
            {filtered.map((c) => (
              <div key={c.id} className="home-card" onClick={() => setSelectedClient(c)}>
                <div className="home-card-initial">
                  {c.nombre?.charAt(0).toUpperCase()}
                </div>
                <div className="home-card-name">{c.nombre}</div>
                <div className="home-card-phone">{c.telefono || "Sin teléfono"}</div>
                <div className="home-card-footer">
                  <span className="home-card-visits">
                    {(c.historial || []).length} visita
                    {(c.historial || []).length !== 1 ? "s" : ""}
                  </span>
                  <span className="home-card-ultima">
                    {getUltimaVisita(c.historial) || "sin visitas"}
                  </span>
                  {isBirthdaySoon(c.cumpleanos) && (
                    <span className="home-card-bday">
                      <Cake size={14} /> pronto
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="home-list">
            {filtered.map((c) => (
              <div key={c.id} className="home-list-item" onClick={() => setSelectedClient(c)}>
                <div className="home-list-initial">
                  {c.nombre?.charAt(0).toUpperCase()}
                </div>
                <div className="home-list-info">
                  <span className="home-list-name">{c.nombre}</span>
                  <span className="home-list-phone">{c.telefono || "Sin teléfono"}</span>
                </div>
                <div className="home-list-meta">
                  <span className="home-card-ultima">
                    {getUltimaVisita(c.historial) || "sin visitas"}
                  </span>
                  <span className="home-card-visits">
                    {(c.historial || []).length} visita
                    {(c.historial || []).length !== 1 ? "s" : ""}
                  </span>
                </div>
                {isBirthdaySoon(c.cumpleanos) && (
                  <span className="home-card-bday">
                    <Cake size={14} /> pronto
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

      </main>

      {showNew && <NewClientForm onClose={() => setShowNew(false)} />}

      {selectedClient && (
        <ClientPanel
          client={clients.find(c => c.id === selectedClient.id) || selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}

    </div>
  );
};

export default Home;