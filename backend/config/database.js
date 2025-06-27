// config/database.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb+srv://frannverdu:1234@cluster.pbp7ewm.mongodb.net/compraya';
                                                                       
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📚 Base de datos: ${conn.connection.name}`); // Debería mostrar 'compraya'
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;