import Users from "../model/usersModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const getAuthentication = (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'No hay token' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token invalido o expirado' });
        }

        res.status(200).json({ message: 'Token valido', userId: decoded.userId });
    });
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ¿Existe el usuario?
        const existingName = await Users.findOne({ name });
        if (existingName) {
            return res.status(400).json({
                error: 'El nombre de usuario ya está en uso'
            });
        }

        // ¿Existe el email?
        const existingEmail = await Users.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                error: 'El correo electrónico ya está en uso'
            });
        }

        // Crea una nueva instancia del modelo Users
        const newUser = new Users({ name, email, password });
    
        // Guarda el nuevo usuario en la base de datos
        const savedUser = await newUser.save();

        // Convierte el documento a un objeto
        const userObject = savedUser.toObject();

        // Elimina la propiedad 'password'
        delete userObject.password;

        // Envía la respuesta sin la contraseña
        res.status(201).json(userObject);
    } catch (error) {
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Compara name
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        let user = null;

        if (name && emailRegex.test(name)) {
            user = await Users.findOne({ email: name });
        } else {
            user = await Users.findOne({ name });
        }

        if (!user) {
            return res.status(400).json({
                error: "Nombre o email incorrectos"
            });
        }

        // Compara password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                error: "Contraseña incorrecta"
            });
        }

        // Genera un token JWT
        const token = jwt.sign(
            { userId: user._id }, JWT_SECRET, { expiresIn: '30d' }
        );

        // Convierte el documento a un objeto
        const userObject = user.toObject();

        // Elimina la propiedad 'password'
        delete userObject.password;

        res.json({user: userObject, token});
    } catch (error) {
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}