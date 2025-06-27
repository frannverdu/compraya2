import { Product } from '../models/models.js';

export const getProducts = async (req, res) => {
    try {
        const data = await Product.find();
        
        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'No hay productos disponibles.' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ id: parseInt(id) });
        if (!product) {
            return res.status(400).json({ message: 'Producto no encontrado.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, desc, price, image } = req.body || {};
        if (!name || !desc || !price || !image) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }
        
        const data = await Product.find();
        const newId = data.length > 0 ? Math.max(...data.map(product => product.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            nombre: name,
            desc,
            precio: price,
            imagen: image
        };
        
        const savedProduct = await Product.create(newProduct);
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al crear el producto' });
    }
};

export const getProductByParams = async (req, res) => {
    try {
        const { names, prices, categories } = req.body || {};
        const data = await Product.find();
        let filteredProducts = data;
        
        // Filtro por nombres
        if (names && Array.isArray(names) && names.length) {
            filteredProducts = filteredProducts.filter(product =>
                names.some(name => product.nombre.toLowerCase().includes(name.toLowerCase()))
            );
        }
        
        // Filtro por precios
        if (prices && Array.isArray(prices) && prices.length >= 2) {
            const minPrice = parseFloat(prices[0]);
            const maxPrice = parseFloat(prices[1]);

            filteredProducts = filteredProducts.filter(product => {
                if (product.precio === undefined || product.precio === null) {
                    return false;
                }
                const productPrice = parseFloat(product.precio);
                return productPrice >= minPrice && productPrice <= maxPrice;
            });
        }
        
        // Filtro por categorías
        if (categories && Array.isArray(categories) && categories.length) {
            filteredProducts = filteredProducts.filter(product =>
                categories.some(category =>
                    product.categoria.toLowerCase() === category.toLowerCase()
                )
            );
        }
        
        if (filteredProducts.length === 0) {
            return res.status(400).json({ message: 'No se encontraron productos con esos parámetros' });
        }

        res.status(200).json(filteredProducts);
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al buscar los productos.' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, desc, price, image } = req.body || {};
        if (!id || !name || !desc || !price || !image) {
            return res.status(400).json({ message: 'Faltan datos obligatorios para actualizar el producto.' });
        }
        
        const product = await Product.findOne({ id: parseInt(id) });
        if (!product) {
            return res.status(400).json({ message: 'Producto no encontrado.' });
        }
        
        const updatedProduct = await Product.findOneAndUpdate(
            { id: parseInt(id) },
            {
                nombre: name,
                desc,
                precio: price,
                imagen: image,
            },
            { new: true }
        );
        
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al actualizar el producto.' });
    }
};