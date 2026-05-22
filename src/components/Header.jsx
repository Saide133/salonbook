import { useClients } from "../context/ClientsContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useClients();

  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-logo">✿</span>
        <div className="header-brand-text">
          <span className="header-name-main">Nubys Silva</span>
          <span className="header-name-sub">Beauty Empire</span>
        </div>
      </div>
      <div className="header-right">
        <span className="header-user">{user?.email.split("@")[0]}</span>
        <button className="header-logout" onClick={logout}>Salir</button>
      </div>
    </header>
  );
};

export default Header;