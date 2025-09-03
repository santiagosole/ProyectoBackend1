import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Conectado a MongoDB');
} catch (err) {
  console.error('❌ Error de conexión:', err);
} finally {
  await mongoose.disconnect();
}
