import express from "express";
import cors from "cors";

import usersRoutes from "./routes/users.routes.js";
import productsRoutes from "./routes/products.routes.js";
import salesRoutes from "./routes/sales.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/sales', salesRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});