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
        const { names, prices } = req.body || {};
        let filteredProducts = data;
        if (names && Array.isArray(names) && names.length) {
            filteredProducts = filteredProducts.filter(product =>
                names.some(name => product.nombre.toLowerCase().includes(name.toLowerCase()))
            );
        }
        if (prices && Array.isArray(prices) && prices.length) {
            filteredProducts = filteredProducts.filter(product =>
                prices.some(price => product.precio.toString().includes(price.toString()))
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
