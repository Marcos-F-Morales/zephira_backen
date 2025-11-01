// ==========================
// Importación de módulos
// ==========================
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// ==========================
// 🔹 CONFIGURACIÓN DE CORS
// ==========================
const allowedOrigins = [
  "http://localhost:5173", // desarrollo local
  "https://zephira.online" // dominio del frontend en producción
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir solicitudes sin origen (Postman, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ CORS bloqueado para:", origin);
        return callback(new Error("No permitido por CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Responder manualmente a solicitudes preflight
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

// ==========================
// Middleware para parsear JSON y formularios
// ==========================
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================
// Conexión con la base de datos
// ==========================
const db = require("./app/models");
db.sequelize
  .sync()
  .then(() => console.log("✅ Base de datos sincronizada correctamente."))
  .catch((err) => console.error("❌ Error al sincronizar la base de datos:", err));

// ==========================
// Rutas base y del proyecto
// ==========================
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a nuestra Tienda de Zephira" });
});

// ==========================
// RUTAS INTERNAS
// ==========================
require("./app/routes/inventario.routes")(app);
require("./app/routes/catalogo.routes")(app);
require("./app/routes/estadoenvio.routes")(app);
require("./app/routes/dashboard.routes.js")(app);

// ==========================
// RUTAS EXTERNAS
// ==========================
const usuarioRoutes = require("./app/routes/usuario.routes.js");
const productoRoutes = require("./app/routes/producto.routes.js");
const tallaRoutes = require("./app/routes/talla.routes.js");
const colorRoutes = require("./app/routes/color.routes.js");
const sucursalRoutes = require("./app/routes/sucursal.routes.js");
const carritoDetalleRoutes = require("./app/routes/carritoDetalle.routes.js");
const carritoRoutes = require("./app/routes/carrito.routes");
const facturaRoutes = require("./app/routes/factura.routes.js");
const envioRoutes = require("./app/routes/envio.routes.js");

app.use("/api/envios", envioRoutes);
app.use("/api/facturas", facturaRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/carritodetalles", carritoDetalleRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/tallas", tallaRoutes);
app.use("/api/colores", colorRoutes);
app.use("/api/sucursales", sucursalRoutes);

// ==========================
// Servidor
// ==========================
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
