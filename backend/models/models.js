
import mongoose from 'mongoose';

export const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');

export const Sale = mongoose.models.Sale || mongoose.model('Sale', new mongoose.Schema({}, { strict: false }), 'sales');

export const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');