import data from '../data/productos.json' with { type: "json" };

export const getProducts = (req, res) => {
    if (!data || data.length === 0) {
        return res.status(400).json({ message: 'No hay productos disponibles.' });
    }
    res.json(data);
};

export const getProduct = (req, res) => {
    const { id } = req.params;
    const product = data.find(product => product.id === parseInt(id));
    if (!product) {
        return res.status(400).json({ message: 'Producto no encontrado.' });
    }
    res.json(product);
};

export const createProduct = (req, res) => {
    try {
        const { name, desc, price, image } = req.body || {};
        if (!name || !desc || !price || !image) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }
        const newId = data.length > 0 ? Math.max(...data.map(product => product.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            nombre: name,
            desc,
            precio: price,
            imagen: image
        };
        data.push(newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al crear el producto' });
    }
};

export const getProductByParams = (req, res) => {
    try {
        const { names, prices, categories } = req.body || {};
        let filteredProducts = data;
        // Filtro por nombres
        if (names && Array.isArray(names) && names.length) {
            filteredProducts = filteredProducts.filter(product =>
                names.some(name => product.name.toLowerCase().includes(name.toLowerCase()))
            );
        }
        // Filtro por precios
        if (prices && Array.isArray(prices) && prices.length >= 2) {
            const minPrice = parseFloat(prices[0]);
            const maxPrice = parseFloat(prices[1]);

            filteredProducts = filteredProducts.filter(product => {
                if (product.price === undefined || product.price === null) {
                    return false;
                }
                const productPrice = parseFloat(product.price);
                return productPrice >= minPrice && productPrice <= maxPrice;
            });
        }
        // Filtro por categorías
        if (categories && Array.isArray(categories) && categories.length) {
            filteredProducts = filteredProducts.filter(product =>
                categories.some(category =>
                    product.category.toLowerCase() === category.toLowerCase()
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

export const updateProduct = (req, res) => {
    try {
        const { id } = req.params;
        const { name, desc, price, image } = req.body || {};
        if (!id || !name || !desc || !price || !image) {
            return res.status(400).json({ message: 'Faltan datos obligatorios para actualizar el producto.' });
        }
        const productIndex = data.findIndex(product => product.id === parseInt(id));
        if (productIndex === -1) {
            return res.status(400).json({ message: 'Producto no encontrado.' });
        }
        data[productIndex] = {
            ...data[productIndex],
            nombre: name,
            desc,
            precio: price,
            imagen: image,
        };
        res.status(200).json(data[productIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al actualizar el producto.' });
    }
};
