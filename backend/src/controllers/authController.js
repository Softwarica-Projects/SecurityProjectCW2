const AuthService = require('../services/AuthService');
const nodemailer = require('nodemailer');

function tryDecodeBase64(value) {
    if (!value || typeof value !== 'string') return value;
    try {
        const maybe = value.replace(/\s+/g, '');
        if (maybe.length % 4 !== 0) return value;
        const buff = Buffer.from(maybe, 'base64');
        const decoded = buff.toString('utf8');
        if (Buffer.from(decoded).toString('base64') === maybe) return decoded;
        return value;
    } catch (e) {
        return value;
    }
}

const https = require('https');

function verifyRecaptchaToken(token, secret) {
    return new Promise((resolve, reject) => {
        if (!token) return resolve(false);
        const postData = `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`;
        const options = {
            hostname: 'www.google.com',
            path: '/recaptcha/api/siteverify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.success === true) return resolve(true);
                    console.warn('reCAPTCHA verification failed:', parsed);
                    return resolve(parsed);
                } catch (e) {
                    console.warn('reCAPTCHA verification parse error', e);
                    resolve(false);
                }
            });
        });

        req.on('error', () => resolve(false));
        req.write(postData);
        req.end();
    });
}

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async registerUser(req, res, next) {
        try {
            const body = { ...req.body };
            if (body.password) body.password = tryDecodeBase64(body.password);
            const recaptchaSecret = process.env.RECAPTCHA_SECRET;
            if (recaptchaSecret) {
                const ok = await verifyRecaptchaToken(body.recaptchaToken, recaptchaSecret);
                    if (!ok || ok !== true) {
                        const debug = (typeof ok === 'object' && process.env.NODE_ENV !== 'production') ? { debug: ok } : {};
                        return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed', ...debug });
                    }
            }
            const user = await this.authService.registerUser(body);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user
            });
        } catch (error) {
            next(error);
        }
    }

    async loginUser(req, res, next) {
        try {
            const body = { ...req.body };
            if (body.password) body.password = tryDecodeBase64(body.password);
            const recaptchaSecret = process.env.RECAPTCHA_SECRET;
            if (recaptchaSecret) {
                const ok = await verifyRecaptchaToken(body.recaptchaToken, recaptchaSecret);
                    if (!ok || ok !== true) {
                        const debug = (typeof ok === 'object' && process.env.NODE_ENV !== 'production') ? { debug: ok } : {};
                        return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed', ...debug });
                    }
            }
            const result = await this.authService.loginUser(body);
            res.status(200).json({
                success: true,
                message: result.message || 'Login successful',
                token: result.token,
                passwordExpired: result.passwordExpired || false,
                user: result.user
            });
        } catch (error) {
            next(error);
        }
    }
    async loginAdmin(req, res, next) {
        try {
            const result = await this.authService.loginAdmin(req.body);
            res.status(200).json({
                success: true,
                message: 'Admin login successful',
                token: result.token,
                role: result.user.role,
                id: result.user.id,
                name: result.user.name,
                email: result.user.email
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const body = { ...req.body };
            if (body.oldPassword) body.oldPassword = tryDecodeBase64(body.oldPassword);
            if (body.newPassword) body.newPassword = tryDecodeBase64(body.newPassword);
            const result = await this.authService.changePassword(req.user.id, body);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async getMe(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const user = await this.authService.getUserProfile(req.user.id);

            res.status(200).json({
                success: true,
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                role: user.role,
                image: user.image ? `${basePath}${user.image}` : null,
            });
        } catch (error) {
            next(error);
        }
    }

}

const authController = new AuthController();

module.exports = {
    registerUser: authController.registerUser.bind(authController),
    loginUser: authController.loginUser.bind(authController),
    loginAdmin: authController.loginAdmin.bind(authController),
    changePassword: authController.changePassword.bind(authController),
    getMe: authController.getMe.bind(authController),
};