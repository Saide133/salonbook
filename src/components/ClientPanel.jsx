import { useState } from "react";
import { useClients } from "../context/ClientsContext";
import { Bell } from "lucide-react";
import "./ClientPanel.css";

const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

const formatDate = (ds) => {
  if (!ds) return "—";
  const d = new Date(ds + "T12:00:00");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const ClientPanel = ({ client, onClose }) => {
  const { updateClient, deleteClient, addVisita, deleteVisita, user } = useClients();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...client });
  const [showAddVisita, setShowAddVisita] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingVisita, setEditingVisita] = useState(null);
  const [editVisitaForm, setEditVisitaForm] = useState({});
  const [newVisita, setNewVisita] = useState({
    fecha: "",
    tratamiento: "",
    comentarios: "",
    seguimiento: false,
    fechaSeguimiento: "",
  });

  const handleSaveEdit = async () => {
    setSaving(true);
    await updateClient(client.id, editForm);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar a ${client.nombre}?`)) return;
    await deleteClient(client.id);
    onClose();
  };

  const handleAddVisita = async () => {
    if (!newVisita.fecha || !newVisita.tratamiento) return;
    setSaving(true);
    await addVisita(client.id, newVisita);
    setSaving(false);
    setShowAddVisita(false);
    setNewVisita({ fecha: "", tratamiento: "", comentarios: "", seguimiento: false, fechaSeguimiento: "" });
  };

  const handleSaveVisita = async () => {
    setSaving(true);
    const historial = (client.historial || []).map((h) =>
      h.id === editingVisita ? { ...h, ...editVisitaForm } : h
    );
    await updateClient(client.id, { historial });
    setSaving(false);
    setEditingVisita(null);
    setEditVisitaForm({});
  };

  const historial = [...(client.historial || [])].sort((a, b) =>
    b.fecha.localeCompare(a.fecha)
  );

  return (
    <div className="cp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cp-panel">

        <div className="cp-header">
          <span className="cp-title">{editing ? "Editando ficha" : client.nombre}</span>
          <div className="cp-header-actions">
            {!editing && (
              <>
                <button className="cp-btn-edit" onClick={() => { setEditForm({ ...client }); setEditing(true); }}>
                  Editar
                </button>
                <button className="cp-btn-delete" onClick={handleDelete}>
                  Eliminar
                </button>
              </>
            )}
            <button className="cp-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="cp-body">
          {editing ? (
            <>
              <p className="cp-section-title">Editar ficha</p>

              <div className="cp-grid2">
                <div>
                  <label className="cp-label">Nombre completo</label>
                  <input className="cp-input" value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} />
                </div>
                <div>
                  <label className="cp-label">Teléfono</label>
                  <input className="cp-input" value={editForm.telefono || ""}
                    onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })} />
                </div>
              </div>

              <label className="cp-label">Fecha de cumpleaños</label>
              <input className="cp-input" type="date" value={editForm.cumpleanos || ""}
                onChange={(e) => setEditForm({ ...editForm, cumpleanos: e.target.value })} />

              <label className="cp-label">Diagnóstico del cabello</label>
              <textarea className="cp-textarea" value={editForm.diagnostico || ""}
                onChange={(e) => setEditForm({ ...editForm, diagnostico: e.target.value })} />

              <label className="cp-label">Notas / Preferencias</label>
              <textarea className="cp-textarea" value={editForm.notas || ""}
                onChange={(e) => setEditForm({ ...editForm, notas: e.target.value })} />

              <div className="cp-actions">
                <button className="cp-btn-cancel" onClick={() => setEditing(false)}>Cancelar</button>
                <button className="cp-btn-save" onClick={handleSaveEdit} disabled={saving}>
                  {saving ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* INFO */}
              <p className="cp-section-title">Información</p>
              <div className="cp-info-grid">
                <div>
                  <div className="cp-info-label">Teléfono</div>
                  <div className="cp-info-val">{client.telefono || "—"}</div>
                </div>
                <div>
                  <div className="cp-info-label">Cumpleaños</div>
                  <div className="cp-info-val">{formatDate(client.cumpleanos)}</div>
                </div>
                <div>
                  <div className="cp-info-label">Registrada el</div>
                  <div className="cp-info-val">{formatDate(client.creadoEn)}</div>
                </div>
                <div>
                  <div className="cp-info-label">Por</div>
                  <div className="cp-info-val">{client.creadoPor}</div>
                </div>
              </div>

              <div className="cp-divider" />

              {/* DIAGNÓSTICO */}
              <p className="cp-section-title">Diagnóstico del cabello</p>
              <p className="cp-text">
                {client.diagnostico || <span className="cp-empty-text">Sin diagnóstico cargado.</span>}
              </p>

              <div className="cp-divider" />

              {/* NOTAS */}
              <p className="cp-section-title">Notas y preferencias</p>
              <p className="cp-text">
                {client.notas || <span className="cp-empty-text">Sin notas.</span>}
              </p>

              <div className="cp-divider" />

              {/* HISTORIAL */}
              <p className="cp-section-title">Historial de visitas</p>

              {historial.length === 0 ? (
                <p className="cp-empty-text" style={{ marginBottom: "16px" }}>
                  Sin visitas registradas todavía.
                </p>
              ) : (
                <div className="cp-historial">
                  {historial.map((h) => {
                    const d = new Date(h.fecha + "T12:00:00");
                    const isEditing = editingVisita === h.id;

                    return (
                      <div key={h.id} className="cp-visita">
                        <div className="cp-visita-date">
                          <span className="cp-visita-day">{d.getDate()}</span>
                          <span className="cp-visita-mon">{months[d.getMonth()]}</span>
                          <span className="cp-visita-yr">{d.getFullYear()}</span>
                        </div>

                        <div className="cp-visita-detail">
                          {isEditing ? (
                            <>
                              <div className="cp-grid2">
                                <div>
                                  <label className="cp-label">Fecha</label>
                                  <input className="cp-input" type="date"
                                    value={editVisitaForm.fecha}
                                    onChange={(e) => setEditVisitaForm({ ...editVisitaForm, fecha: e.target.value })} />
                                </div>
                                <div>
                                  <label className="cp-label">Tratamiento</label>
                                  <input className="cp-input"
                                    value={editVisitaForm.tratamiento}
                                    onChange={(e) => setEditVisitaForm({ ...editVisitaForm, tratamiento: e.target.value })} />
                                </div>
                              </div>
                              <label className="cp-label">
                                Comentarios <span className="cp-optional">(opcional)</span>
                              </label>
                              <textarea className="cp-textarea"
                                value={editVisitaForm.comentarios || ""}
                                onChange={(e) => setEditVisitaForm({ ...editVisitaForm, comentarios: e.target.value })} />

                              <div className="cp-seguimiento-row">
                                <input
                                  type="checkbox"
                                  id="seguimientoEdit"
                                  checked={editVisitaForm.seguimiento || false}
                                  onChange={(e) => setEditVisitaForm({ ...editVisitaForm, seguimiento: e.target.checked, fechaSeguimiento: "" })}
                                />
                                <label htmlFor="seguimientoEdit" className="cp-seguimiento-label">
                                  Recordatorio de seguimiento
                                </label>
                              </div>

                              {editVisitaForm.seguimiento && (
                                <div className="cp-seguimiento-fecha">
                                  <label className="cp-label">Fecha de seguimiento</label>
                                  <input className="cp-input" type="date"
                                    value={editVisitaForm.fechaSeguimiento || ""}
                                    onChange={(e) => setEditVisitaForm({ ...editVisitaForm, fechaSeguimiento: e.target.value })} />
                                </div>
                              )}

                              <div className="cp-actions">
                                <button className="cp-btn-cancel" onClick={() => setEditingVisita(null)}>Cancelar</button>
                                <button className="cp-btn-save" onClick={handleSaveVisita} disabled={saving}>
                                  {saving ? "Guardando…" : "Guardar"}
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="cp-visita-trat">{h.tratamiento}</div>
                              <div className="cp-visita-by">por {h.usuarioPor}</div>
                              {h.comentarios && (
                                <div className="cp-visita-com">{h.comentarios}</div>
                              )}
                              {h.seguimiento && h.fechaSeguimiento && (
                                <div className="cp-visita-seguimiento">
                                  <Bell size={12} />
                                  Seguimiento: {formatDate(h.fechaSeguimiento)}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {!isEditing && (
                          <div className="cp-visita-actions">
                            <button className="cp-visita-edit" onClick={() => {
                              setEditingVisita(h.id);
                              setEditVisitaForm({ 
                                fecha: h.fecha, 
                                tratamiento: h.tratamiento, 
                                comentarios: h.comentarios || "",
                                seguimiento: h.seguimiento || false,
                                fechaSeguimiento: h.fechaSeguimiento || "",
                              });
                            }}>✎</button>
                            <button className="cp-visita-del" onClick={() => deleteVisita(client.id, h.id)}>✕</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {showAddVisita ? (
                <div className="cp-add-visita">
                  <div className="cp-grid2">
                    <div>
                      <label className="cp-label">Fecha</label>
                      <input className="cp-input" type="date" value={newVisita.fecha}
                        onChange={(e) => setNewVisita({ ...newVisita, fecha: e.target.value })} />
                    </div>
                    <div>
                      <label className="cp-label">Tratamiento</label>
                      <input className="cp-input" placeholder="Ej: Corte + keratina"
                        value={newVisita.tratamiento}
                        onChange={(e) => setNewVisita({ ...newVisita, tratamiento: e.target.value })} />
                    </div>
                  </div>
                  <label className="cp-label">
                    Comentarios <span className="cp-optional">(opcional)</span>
                  </label>
                  <textarea className="cp-textarea" placeholder="Observaciones, reacciones, próximos pasos…"
                    value={newVisita.comentarios}
                    onChange={(e) => setNewVisita({ ...newVisita, comentarios: e.target.value })} />

                  <div className="cp-seguimiento-row">
                    <input
                      type="checkbox"
                      id="seguimientoNew"
                      checked={newVisita.seguimiento}
                      onChange={(e) => setNewVisita({ ...newVisita, seguimiento: e.target.checked, fechaSeguimiento: "" })}
                    />
                    <label htmlFor="seguimientoNew" className="cp-seguimiento-label">
                      Recordatorio de seguimiento
                    </label>
                  </div>

                  {newVisita.seguimiento && (
                    <div className="cp-seguimiento-fecha">
                      <label className="cp-label">Fecha de seguimiento</label>
                      <input className="cp-input" type="date"
                        value={newVisita.fechaSeguimiento}
                        onChange={(e) => setNewVisita({ ...newVisita, fechaSeguimiento: e.target.value })} />
                    </div>
                  )}

                  <div className="cp-actions">
                    <button className="cp-btn-cancel" onClick={() => setShowAddVisita(false)}>Cancelar</button>
                    <button className="cp-btn-save" onClick={handleAddVisita} disabled={saving}>
                      {saving ? "Guardando…" : "Guardar visita"}
                    </button>
                  </div>
                </div>
              ) : (
                <button className="cp-btn-add-visita" onClick={() => setShowAddVisita(true)}>
                  + Agregar visita
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPanel;