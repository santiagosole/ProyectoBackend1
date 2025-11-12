import express from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/User.model.js';
import { createHash, isValidPassword } from '../../utils/hash.js';

const router = express.Router();

// 📌 REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).send({ message: 'Usuario ya existe' });

    const hashedPassword = createHash(password);
    await UserModel.create({ first_name, last_name, email, age, password: hashedPassword });

    res.status(201).send({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).send({ error: 'Error en registro', details: error.message });
  }
});

// 📌 LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || !isValidPassword(user, password))
      return res.status(401).send({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ user }, 'coderSecretJWT', { expiresIn: '24h' });
    res.cookie('jwtCookie', token, { httpOnly: true });
    res.send({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).send({ error: 'Error en login' });
  }
});

// 📌 CURRENT USER
router.get('/current', (req, res) => {
  try {
    const token = req.cookies.jwtCookie;
    if (!token) return res.status(401).send({ message: 'Token no encontrado' });

    const decoded = jwt.verify(token, 'coderSecretJWT');
    res.send({ user: decoded.user });
  } catch (error) {
    res.status(403).send({ message: 'Token inválido o expirado' });
  }
});

export default router;
