import { useState } from "react";
import { useClients } from "../context/ClientsContext";
import Header from "./Header";
import NewClientForm from "./NewClientForm";
import ClientPanel from "./ClientPanel";
import "./Home.css";
import { Cake, Search, Plus } from "lucide-react";

const isBirthdaySoon = (ds) => {
  if (!ds) return false;
  const today = new Date();
  const b = new Date(ds + "T12:00:00");
  const next = new Date(today.getFullYear(), b.getMonth(), b.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return (next - today) / (1000 * 60 * 60 * 24) <= 7;
};

const Home = () => {
  const { clients, loadingClients } = useClients();
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const filtered = clients.filter(
    (c) =>
      c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      c.telefono?.includes(search)
  );

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
        ) : (
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
                  {isBirthdaySoon(c.cumpleanos) && (
                    <span className="home-card-bday">
                      <Cake size={13} /> pronto
                    </span>
                  )}
                </div>
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