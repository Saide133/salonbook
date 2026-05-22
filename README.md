# 🌸 Nubys Silva Beauty Empire — App de Gestión

Aplicación web para la gestión interna de clientas del salón **Nubys Silva Beauty Empire**. Permite llevar fichas detalladas, historial de visitas y recordatorios de cumpleaños.

---

## ✨ Funcionalidades

- 🔐 Login por usuaria (sin registro público)
- 📋 Fichas de clientas con nombre, teléfono, cumpleaños, diagnóstico del cabello y notas
- 📅 Historial de visitas con tratamiento, comentarios y usuaria que lo registró
- ✏️ Edición y eliminación de fichas y visitas
- 🎂 Banner de aviso de cumpleaños próximos
- 🔍 Búsqueda por nombre o teléfono
- 📱 Diseño responsive — funciona en mobile y desktop

---

## 🛠️ Tecnologías

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Firebase Auth](https://firebase.google.com/products/auth) — autenticación
- [Firebase Firestore](https://firebase.google.com/products/firestore) — base de datos
- [Lucide React](https://lucide.dev/) — iconos
- CSS modular por componente

---

## 🚀 Deploy

La app está disponible en:
👉 [nubysbeauty.netlify.app](https://nubysbeauty.netlify.app)

---

## ⚙️ Configuración local

1. Cloná el repositorio
2. Instalá las dependencias:
```bash
   npm install
```
3. Creá un archivo `.env` basado en `.env.example` y completá con tus credenciales de Firebase
4. Corré el servidor de desarrollo:
```bash
   npm run dev
```

---

## 🔒 Seguridad

- Las credenciales de Firebase se manejan con variables de entorno y nunca se suben al repositorio
- El acceso a Firestore está restringido a usuarias autenticadas mediante reglas de seguridad
- No hay registro público — las usuarias son creadas manualmente desde la consola de Firebase

---

## 📁 Estructura del proyecto
```bash
src/
├── components/
│   ├── Header.jsx / Header.css
│   ├── Home.jsx / Home.css
│   ├── Login.jsx / Login.css
│   ├── ClientPanel.jsx / ClientPanel.css
│   └── NewClientForm.jsx / NewClientForm.css
├── context/
│   └── ClientsContext.jsx
├── firebase/
│   └── config.js
├── App.jsx
└── main.jsx
```
---

Desarrollado con 🌸 para Nubys Silva Beauty Empire — Uruguay
