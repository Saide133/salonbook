import { useState, useRef } from "react";
import { useClients } from "../context/ClientsContext";
import "./NewClientForm.css";
import MicButton from "./MicButton";
import "./MicButton.css";

const NewClientForm = ({ onClose }) => {
  const { addClient, user } = useClients();
  const [saving, setSaving] = useState(false);
  const bodyRef = useRef(null);
  const scrollUp = () => bodyRef.current?.scrollBy({ top: -150, behavior: "smooth" });
  const scrollDown = () => bodyRef.current?.scrollBy({ top: 150, behavior: "smooth" });

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    cumpleanos: "",
    diagnostico: "",
    notas: "",
  });

  const [primeraVisita, setPrimeraVisita] = useState({
    agregar: false,
    fecha: "",
    tratamiento: "",
    comentarios: "",
  });

  const handleSave = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);

    const historial = [];
    if (primeraVisita.agregar && primeraVisita.fecha && primeraVisita.tratamiento) {
      historial.push({
        id: Date.now(),
        fecha: primeraVisita.fecha,
        tratamiento: primeraVisita.tratamiento,
        comentarios: primeraVisita.comentarios,
        usuarioPor: user.email,
      });
    }

    await addClient({ ...form, historial });
    setSaving(false);
    onClose();
  };

  return (
    <div className="ncf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ncf-panel">

        <div className="ncf-header">
          <span className="ncf-title">Nueva clienta</span>
          <button className="ncf-close" onClick={onClose}>✕</button>
        </div>

        <div className="ncf-body" ref={bodyRef}>

          <p className="ncf-section-title">Datos personales</p>
          <div className="ncf-grid2">
            <div>
              <label className="ncf-label">Nombre completo *</label>
              <input className="ncf-input" placeholder="Nombre y apellido"
                value={form.nombre}
                onChange={(e) => {
                  const val = e.target.value;
                  const capitalizado = val.charAt(0).toUpperCase() + val.slice(1);
                  setForm({ ...form, nombre: capitalizado });
                }} />
            </div>
            <div>
              <label className="ncf-label">Teléfono</label>
              <input className="ncf-input" placeholder="09X XXX XXX"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </div>
          </div>

          <label className="ncf-label">Fecha de cumpleaños</label>
          <input className="ncf-input" type="date"
            value={form.cumpleanos}
            onChange={(e) => setForm({ ...form, cumpleanos: e.target.value })} />

          <div className="ncf-divider" />
          <p className="ncf-section-title">Ficha técnica</p>

          <div className="ncf-field-with-mic">
            <label className="ncf-label">Diagnóstico del cabello</label>
            <MicButton onResult={(text) => setForm({ ...form, diagnostico: form.diagnostico + " " + text })} currentValue={form.diagnostico} />
          </div>
          <textarea className="ncf-textarea" placeholder="Tipo de cabello, estado, observaciones técnicas…"
            value={form.diagnostico}
            onChange={(e) => setForm({ ...form, diagnostico: e.target.value })} />

          <div className="ncf-field-with-mic">
            <label className="ncf-label">Notas / Preferencias</label>
            <MicButton onResult={(text) => setForm({ ...form, notas: form.notas + " " + text })} currentValue={form.notas} />
          </div>
          <textarea className="ncf-textarea" placeholder="Gustos, particularidades, alergias…"
            value={form.notas}
            onChange={(e) => setForm({ ...form, notas: e.target.value })} />

          <div className="ncf-divider" />
          <p className="ncf-section-title">Primera visita</p>

          <div className="ncf-check-row">
            <input type="checkbox" id="agregarVisita"
              checked={primeraVisita.agregar}
              onChange={(e) => setPrimeraVisita({ ...primeraVisita, agregar: e.target.checked })} />
            <label htmlFor="agregarVisita" className="ncf-check-label">
              Registrar una visita al crear la ficha
            </label>
          </div>

          {primeraVisita.agregar && (
            <div className="ncf-visita-box">
              <div className="ncf-grid2">
                <div>
                  <label className="ncf-label">Fecha</label>
                  <input className="ncf-input" type="date"
                    value={primeraVisita.fecha}
                    onChange={(e) => setPrimeraVisita({ ...primeraVisita, fecha: e.target.value })} />
                </div>
                <div>
                  <label className="ncf-label">Tratamiento</label>
                  <input className="ncf-input" placeholder="Ej: Corte + keratina"
                    value={primeraVisita.tratamiento}
                    onChange={(e) => setPrimeraVisita({ ...primeraVisita, tratamiento: e.target.value })} />
                </div>
              </div>
              <label className="ncf-label">
                Comentarios <span className="ncf-optional">(opcional)</span>
              </label>
              <textarea className="ncf-textarea" placeholder="Observaciones, reacciones, próximos pasos…"
                value={primeraVisita.comentarios}
                onChange={(e) => setPrimeraVisita({ ...primeraVisita, comentarios: e.target.value })} />
            </div>
          )}

          <div className="ncf-actions">
            <button className="ncf-btn-cancel" onClick={onClose}>Cancelar</button>
            <button
              className="ncf-btn-save"
              onClick={handleSave}
              disabled={saving || !form.nombre.trim()}
            >
              {saving ? "Guardando…" : "Crear ficha"}
            </button>
          </div>

        </div>

        <div className="ncf-scroll-arrows">
          <button className="ncf-scroll-btn" onClick={scrollUp}>▲</button>
          <button className="ncf-scroll-btn" onClick={scrollDown}>▼</button>
        </div>

      </div>
    </div>
  );
};

export default NewClientForm;