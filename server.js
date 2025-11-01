// Importamos módulos
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// ==========================
// 🔹 CORS GLOBAL — acepta cualquier dominio
// ==========================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // permite todos los orígenes
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // responde directamente las solicitudes preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// También inicializamos cors() como fallback
app.use(cors());

// ==========================
// Middleware para parsear JSON y formularios
// ==========================
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================
// Conexión con la base de datos
// ==========================
const db = require("./app/models");
db.sequelize.sync();

// ==========================
// Ruta base
// ==========================
require("./app/routes/inventario.routes")(app);

require("./app/routes/catalogo.routes")(app);
require("./app/routes/estadoenvio.routes")(app);
require("./app/routes/dashboard.routes.js")(app);

// ==========================
//   RUTAS CON ROUTERS EXTERNOS
// ==========================
const usuarioRoutes = require("./app/routes/usuario.routes.js");
const productoRoutes = require("./app/routes/producto.routes.js");
const tallaRoutes = require("./app/routes/talla.routes.js");
const colorRoutes = require("./app/routes/color.routes.js");
const sucursalRoutes = require("./app/routes/sucursal.routes.js");
const carritoDetalleRoutes = require("./app/routes/carritoDetalle.routes.js");

const carritoRoutes = require("./app/routes/carrito.routes");

//const estadoEnvioRoutes = require("./app/routes/estadoenvio.routes");
const facturaRoutes = require("./app/routes/factura.routes.js");
const envioRoutes = require("./app/routes/envio.routes.js");

app.use("/api/Envios", envioRoutes);
app.use("/api/facturas", facturaRoutes);
//app.use("/api/estadoEnvios", estadoEnvioRoutes); 

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
  console.log(`✅ Server is running on port ${PORT}.`);
});
