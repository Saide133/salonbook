import { useClients } from "./context/ClientsContext";
import Login from "./components/Login";
import Home from "./components/Home";

const App = () => {
  const { user, authLoading } = useClients();

  if (authLoading) {
    return (
      <div style={styles.loading}>
        <p style={styles.loadingText}>Cargando…</p>
      </div>
    );
  }

  if (!user) return <Login />;

  return <Home />;
};

const styles = {
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fdf6f0",
  },
  loadingText: { color: "#b8a0a0", fontSize: "14px", letterSpacing: "1px" },
};

export default App;