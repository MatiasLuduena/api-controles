import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true, unique: true
        },
        email: {
            type: String, required: true, unique: true
        },
        password: {
            type: String, required: true
        }
    },
    {
        versionKey: false
    }
);

userSchema.pre('save', async function(next) {
    try {
        // Solo encriptar la contraseña si ha sido modificada (o es nueva)
        if (!this.isModified('password')) {
            return next();
        }

        // Generar una sal para encriptar la contraseña
        const salt = await bcrypt.genSalt(10);

        // Encriptar la contraseña con la sal
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // Reemplazar la contraseña original con la contraseña encriptada
        this.password = hashedPassword;

        next();
    } catch (error) {
        return next(error);
    }
});

const Users = mongoose.model('Users', userSchema);

export default Users;