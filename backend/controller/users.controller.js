import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, Sale } from '../models/models.js';

export const getUsers = async (req, res) => {
  try {
    const usersData = await User.find();
    if (!usersData || usersData.length === 0) {
      return res.status(400).json({ message: 'No hay usuarios disponibles.' });
    }
    res.json(usersData);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id: parseInt(id) });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body || {};
    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const usersData = await User.find();
    const newId = usersData.length > 0 ? Math.max(...usersData.map(user => user.id)) + 1 : 1;
    const newUser = {
      id: newId,
      nombre: name,
      apellido: lastName,
      email,
      password: hashedPassword
    };
    const savedUser = await User.create(newUser);
    const userResponse = savedUser;
    res.status(201).json(userResponse);
    
  } catch (error) {
    res.status(500).json({ message: 'Hubo un error al crear el usuario' });
  }
};

export const getUserByParams = async (req, res) => {
  try {
    const { names, lastNames, emails } = req.body || {};
    const usersData = await User.find();
    let filteredUsers = usersData;
    if (names && Array.isArray(names) && names.length) {
      filteredUsers = filteredUsers.filter(user =>
        names.some(name => user.nombre.toLowerCase().includes(name.toLowerCase()))
      );
    }
    if (lastNames && Array.isArray(lastNames) && lastNames.length) {
      filteredUsers = filteredUsers.filter(user =>
        lastNames.some(lastName => user.apellido.toLowerCase().includes(lastName.toLowerCase()))
      );
    }
    if (emails && Array.isArray(emails) && emails.length) {
      filteredUsers = filteredUsers.filter(user =>
        emails.some(email => user.email.toLowerCase().includes(email.toLowerCase()))
      );
    }
    if (filteredUsers.length === 0) {
      return res.status(400).json({ message: 'No se encontraron usuarios con esos parámetros' });
    }
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: 'Hubo un problema al buscar los usuarios.' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastName, email, password } = req.body || {};
    if (!id || !name || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos obligatorios para actualizar el usuario.' });
    }
    const user = await User.findOne({ id: parseInt(id) });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }
    const updatedUser = await User.findOneAndUpdate(
      { id: parseInt(id) },
      {
        nombre: name,
        apellido: lastName,
        email: email,
        password: password,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Hubo un problema al actualizar el usuario.' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const sales = await Sale.find();
    const userHasSales = sales.some(sale => sale.id_usuario === parseInt(id));
    if (userHasSales) {
      return res.status(400).json({ message: 'No se puede eliminar el usuario porque está vinculado a una venta.' });
    }
    const user = await User.findOne({ id: parseInt(id) });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }
    await User.findOneAndDelete({ id: parseInt(id) });
    res.status(200).json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};