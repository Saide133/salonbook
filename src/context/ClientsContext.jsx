import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "../firebase/config";

const ClientsContext = createContext();

export const useClients = () => useContext(ClientsContext);

export const ClientsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoadingClients(true);
    const q = query(collection(db, "clientas"), orderBy("nombre"));
    const unsub = onSnapshot(q, (snap) => {
      setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingClients(false);
    });
    return unsub;
  }, [user]);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const getNombre = () => {
    if (!user) return "";
    return user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1);
  };

  const addClient = async (data) => {
    const docData = {
      ...data,
      historial: data.historial || [],
      creadoPor: getNombre(),
      creadoEn: new Date().toISOString().split("T")[0],
      creadoTs: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, "clientas"), docData);
    const newClient = { id: ref.id, ...docData };
    setClients((prev) =>
      [...prev, newClient].sort((a, b) => a.nombre.localeCompare(b.nombre))
    );
    return newClient;
  };

  const updateClient = async (id, data) => {
    await updateDoc(doc(db, "clientas", id), data);
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const deleteClient = async (id) => {
    await deleteDoc(doc(db, "clientas", id));
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const addVisita = async (clientId, visita) => {
    const client = clients.find((c) => c.id === clientId);
    const historial = [
      { ...visita, id: Date.now(), usuarioPor: getNombre() },
      ...(client.historial || []),
    ];
    await updateDoc(doc(db, "clientas", clientId), { historial });
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, historial } : c))
    );
  };

  const deleteVisita = async (clientId, visitaId) => {
    const client = clients.find((c) => c.id === clientId);
    const historial = (client.historial || []).filter(
      (h) => h.id !== visitaId
    );
    await updateDoc(doc(db, "clientas", clientId), { historial });
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, historial } : c))
    );
  };

  return (
    <ClientsContext.Provider
      value={{
        user,
        authLoading,
        clients,
        loadingClients,
        login,
        logout,
        addClient,
        updateClient,
        deleteClient,
        addVisita,
        deleteVisita,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};