const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const AppError = require('../errors/appError');
const logger = require('../loaders/logger');
const config = require('../config');

const login = async(email, password) => {


    try {

        //Validación de email
        const user = await userService.findByEmail(email);

        if(!user){
            throw new AppError('Authentication failed! Email / password does not correct.', 400);
        }

        //Validación de usaurio habilitado
        if(!user.enable){
            throw new AppError('Authentication failed! User disabled.', 400);
        }

        //Validación de password
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            throw new AppError('Authentication failed! Email / password does not correct.', 400);
        }

        //Generar JWT
        const token = _encrypt(user._id);

        return {
            token,
            user: user.name,
            role: user.role
        }

    }catch(error) {
        throw error;
    }

}

_encrypt = (id) => {
    return jwt.sign({ id }, config.auth.secret, { expiresIn: config.auth.ttl });
}

module.exports = {
    login
}