require('dotenv').config();
const bcrypt = require('bcrypt');

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
}

exports.hashPassword = async (password) => {
    if (!isStrongPassword(password)) {
        throw new Error('WEAK_PASSWORD');
    }
    return bcrypt.hash(password, saltRounds);
}

exports.comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
}

