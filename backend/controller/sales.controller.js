import { Sale, User, Product } from '../models/models.js';

export const getSales = async (req, res) => {
    try {
        const sales = await Sale.find();
        if (!sales || sales.length === 0) {
            return res.status(400).json({ message: 'No hay ventas disponibles.' });
        }
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ventas' });
    }
};

export const getSale = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sale.findOne({ id: parseInt(id) });
        if (!sale) {
            return res.status(400).json({ message: 'Venta no encontrada.' });
        }
        res.json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener venta' });
    }
};

export const createSale = async (req, res) => {
    try {
        const { userId, date, total, address, products } = req.body || {};
        if (!userId || !date || !total || !address || !products || !products.length) {
            return res.status(400).json({ message: 'Faltan datos obligatorios para crear la venta.' });
        }
        
        // Validar que exista el usuario
        const users = await User.find();
        const userExists = users.some(user => user.id === userId);
        if (!userExists) {
            return res.status(400).json({ message: 'El usuario no existe.' });
        }
        
        // Validar que existan los productos
        const productsData = await Product.find();
        
        
        const invalidProductIds = products.filter(product => {
            const exists = productsData.some(item => {
                const dbId = item.toObject ? item.toObject().id : item.id;
                return parseInt(dbId) === parseInt(product.id);
            });
            return !exists;
        }).map(product => product.id);
        
        if (invalidProductIds.length > 0) {
            return res.status(400).json({ message: `Los siguientes productos no existen: ${invalidProductIds.join(', ')}` });
        }
        
        const sales = await Sale.find();
        const newId = sales.length > 0 ? Math.max(...sales.map(sale => sale.id)) + 1 : 1;
        const newSale = {
            id: newId,
            id_usuario: userId,
            fecha: date,
            total,
            direccion: address,
            productos: products
        };
        const savedSale = await Sale.create(newSale);
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al crear la venta.' });
    }
};

export const getSalesByParams = async (req, res) => {
    try {
        const { dates, users, totals } = req.body || {};
        const sales = await Sale.find();
        let filteredSales = sales;
        if (dates && Array.isArray(dates) && dates.length) {
            filteredSales = filteredSales.filter(sale =>
                dates.some(date => sale.fecha.includes(date))
            );
        }
        if (users && Array.isArray(users) && users.length) {
            filteredSales = filteredSales.filter(sale =>
                users.includes(sale.id_usuario)
            );
        }
        if (totals && Array.isArray(totals) && totals.length) {
            filteredSales = filteredSales.filter(sale =>
                totals.some(total => sale.total.toString().includes(total.toString()))
            );
        }
        if (filteredSales.length === 0) {
            return res.status(400).json({ message: 'No se encontraron ventas con esos parámetros' });
        }
        res.status(200).json(filteredSales);
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al buscar las ventas.' });
    }
};

export const updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, total, address, products, userId } = req.body || {};
        if (!id || !date || !total || !address || !products || !products.length || !userId) {
            return res.status(400).json({ message: 'Faltan datos obligatorios para actualizar la venta.' });
        }
        // Validar que exista el usuario
        const users = await User.find();
        const userExists = users.some(user => user.id === userId);
        if (!userExists) {
            return res.status(400).json({ message: 'El usuario no existe.' });
        }
        // Validar que exista el producto
        const productsData = await Product.find();
        const invalidProductIds = products.filter(product => !productsData.some(item => item.id === product.id)).map(product => product.id);
        if (invalidProductIds.length > 0) {
            return res.status(400).json({ message: `Los siguientes productos no existen: ${invalidProductIds.join(', ')}` });
        }
        const sale = await Sale.findOne({ id: parseInt(id) });
        if (!sale) {
            return res.status(400).json({ message: 'Venta no encontrada.' });
        }
        const updatedSale = await Sale.findOneAndUpdate(
            { id: parseInt(id) },
            {
                fecha: date,
                total,
                direccion: address,
                productos: products,
                id_usuario: userId,
            },
            { new: true }
        );
        res.status(200).json(updatedSale);
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al actualizar la venta.' });
    }
};