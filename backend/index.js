import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import usersRoutes from "./routes/users.routes.js";
import productsRoutes from "./routes/products.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || "encriptacion", (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/sales', authenticateToken, salesRoutes);
app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});