const userRepository = require('../repositories/user.repository');
const baseResponse = require('../utils/baseResponse.util');
const isValidEmail = require('../utils/isValidEmail.util');

const password = require('../utils/password.util');

exports.registerUser = async (req, res) => {

    if (!req.query.email || !req.query.password || !req.query.name) {
        return baseResponse (
            res,
            false,
            400,
            'Missing email, password, or name.'
        );
    }

    if (!isValidEmail(req.query.email)) {
        return baseResponse (
            res,
            false,
            400,
            'Invalid email.'
        );
    }

    try {
        req.query.password = await password.hashPassword(req.query.password);

        const user = await userRepository.registerUser(req.query);
        baseResponse (
            res,
            true,
            201,
            'User created.',
            user
        );
    } catch (error) {
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return baseResponse (
                res,
                false,
                400,
                'Email already in use.'
            );
        }

        baseResponse (
            res,
            false,
            500,
            error.message || 'Error registering user.'
        );
    }
};

exports.loginUser = async (req, res) => {
    if (!req.query.email || !req.query.password) {
        return baseResponse (
            res,
            false,
            400,
            'Missing email or password.'
        );
    }

    
    try {
        const user = await userRepository.loginUser(req.query);
        if (user == null || !password.comparePassword(req.query.password, user.password)) {
            return baseResponse (
                res,
                false,
                400,
                'Invalid email or password.'
            );
        }

        baseResponse (
            res,
            true,
            201,
            'Login success.',
            user
        );
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'User login error.'
        );
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const user = await userRepository.getUserByEmail(req.params.email);
        if (user == null) {
            return baseResponse (
                res,
                false,
                400,
                'User not found.'
            );
        }
        baseResponse (
            res,
            true,
            200,
            'User found.',
            user
        );
    } catch (error) {
        baseResponse (
            res,
            false, 
            500,
            error.message || 'Error retrieving user.'
        );
    }
};

exports.updateUser = async (req, res) => {
    if (!req.body.id || !req.body.email || !req.body.password || !req.body.name) {
        return baseResponse (
            res,
            false,
            400,
            'Missing id, email, password, or name.'
        );
    }

    if (!isValidEmail(req.body.email)) {
        return baseResponse (
            res,
            false,
            400,
            'Invalid email.'
        );
    }

    try {
        req.body.password = await password.hashPassword(req.body.password);
        const user = await userRepository.updateUser(req.body);
        if (user == null) {
            return baseResponse (
                res,
                false,
                400,
                'User not found.'
            );
        }
        baseResponse (
            res,
            true,
            200,
            'User updated.',
            user
        )
    } catch (error) {
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return baseResponse (
                res,
                false,
                400,
                'Email already in use.'
            );
        }


        baseResponse (
            res,
            false,
            500,
            error.message || 'Error updating user.'
        );
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await userRepository.deleteUser(req.params.id);
        if (user == null) {
            return baseResponse (
                res,
                false,
                400,
                'User not found.'
            );
        }
        baseResponse (
            res,
            true,
            200,
            'User deleted.',
            user
        );
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'Error deleting user.'
        );
    }
};

exports.topUp = async (req, res) => {
    try {
        if (req.query.amount <= 0) {
            return baseResponse (
                res,
                false,
                400,
                'Amount must be larger than 0.'
            );
        }
        const user = await userRepository.topUp({
            id: req.query.id,
            amount: req.query.amount
        });
        if (user == null) {
            return baseResponse (
                res,
                false,
                400,
                'User not found.'
            );
        }
        baseResponse (
            res,
            true,
            200,
            'Top up successful.',
            user
        );
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'Error on user top up.'
        );
    }
}