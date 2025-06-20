import { Router } from 'express';

import {
  getProducts,
  createProduct,
  getProductByParams,
  updateProduct,
  getProduct,
} from "../controller/products.controller.js";

const router = Router();

router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.post("/product", createProduct);
router.post("/product/byparams", getProductByParams);
router.put("/product/:id", updateProduct);

export default router;
