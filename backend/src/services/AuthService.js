const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const { JWT_SECRET } = require('../config/jwtConfig');
const { ValidationException, NotFoundException, ConflictException, UnauthorizedException } = require('../exceptions');
const Roles = require('../enums/roles.enum');
const RegexConstants = require('../constants/regex.constants');

const PASSWORD_EXPIRY_DAYS = parseInt(process.env.PASSWORD_EXPIRY_DAYS || '90'); 
const PASSWORD_HISTORY_LIMIT = parseInt(process.env.PASSWORD_HISTORY_LIMIT || '3'); 

const MAX_FAILED_LOGIN_ATTEMPTS = parseInt(process.env.MAX_FAILED_LOGIN_ATTEMPTS || '5');
const LOCKOUT_MINUTES = parseInt(process.env.LOCKOUT_MINUTES || '15');

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    validateEmail(email) {
        if (!email) {
            throw new ValidationException('Email is required', 'email');
        }
        if (!RegexConstants.EMAIL.test(email)) {
            throw new ValidationException('Invalid email address', 'email');
        }
    }

    validatePassword(password) {
        if (!password) {
            throw new ValidationException('Password is required', 'password');
        }
        if (password.length < 6) {
            throw new ValidationException('Password must be at least 6 characters long', 'password');
        }
    }

    validateName(name) {
        if (!name) {
            throw new ValidationException('Name is required', 'name');
        }
        if (name.trim().length < 2) {
            throw new ValidationException('Name must be at least 2 characters long', 'name');
        }
    }

    validateUserData(userData) {
        const { name, email, password } = userData;
        this.validateName(name);
        this.validateEmail(email);
        this.validatePassword(password);
    }

    async isAccountLocked(user) {
        if (user.lockoutUntil && new Date() < new Date(user.lockoutUntil)) {
            const msRemaining = new Date(user.lockoutUntil).getTime() - Date.now();
            const days = Math.floor(msRemaining / (24 * 60 * 60 * 1000));
            const minutes = Math.ceil((msRemaining - days * 24 * 60 * 60 * 1000) / (60 * 1000));
            let messageToSend = '';
            if (days > 0) {
                messageToSend = `${days} day${days > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
            } else {
                messageToSend = `${minutes} minute${minutes > 1 ? 's' : ''}`;
            }
            throw new ValidationException(`Your account is locked for ${messageToSend}`);
        }
    }

    async verifyPassword(user, password) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const attempts = (user.failedLoginAttempts || 0) + 1;
            const update = { failedLoginAttempts: attempts };
            if (attempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
                const lockoutUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
                update.lockoutUntil = lockoutUntil;
                update.failedLoginAttempts = 0;
            }
            await this.userRepository.updateById(user._id, update);
            if (update.lockoutUntil) {
                const ms = update.lockoutUntil.getTime() - Date.now();
                const days = Math.floor(ms / (24 * 60 * 60 * 1000));
                const minutes = Math.ceil((ms - days * 24 * 60 * 60 * 1000) / (60 * 1000));
                let messageToSend = '';
                if (days > 0) {
                    messageToSend = `${days} day${days > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
                } else {
                    messageToSend = `${minutes} minute${minutes > 1 ? 's' : ''}`;
                }
                throw new ValidationException(`Invalid password. Your account has been locked for ${messageToSend}`);
            }

            const attemptsRemaining = Math.max(0, MAX_FAILED_LOGIN_ATTEMPTS - attempts);
            throw new ValidationException(`Invalid password. You have ${attemptsRemaining} 
                attempt${attemptsRemaining !== 1 ? 's' : ''} left. 
                After that your account will be locked for ${LOCKOUT_MINUTES} minute${LOCKOUT_MINUTES !== 1 ? 's' : ''}.`);
        }
        if (user.failedLoginAttempts || user.lockoutUntil) {
            await this.userRepository.updateById(user._id, { failedLoginAttempts: 0, lockoutUntil: null });
        }
    }

    async registerUser(userData) {
        const { name, email, password } = userData;
        this.validateName(name);
        this.validateEmail(email);
        this.validatePassword(password);

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    const userModel = {
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            role: Roles.USER,
            passwordHistory: [hashedPassword],
            passwordChangedAt: new Date()
        };
        const newUser = await this.userRepository.create(userModel);

        const { password: _, ...userWithoutPassword } = newUser.toObject();
        return userWithoutPassword;
    }

    async loginUser(credentials) {
        const { email, password } = credentials;
        this.validatePassword(password);
        if (!email || !RegexConstants.EMAIL.test(email)) {
            throw new ValidationException('Invalid email address', 'email');
        }
        const user = await this.userRepository.findByEmail(email.toLowerCase());
        if (!user) {
            throw new ValidationException('Invalid email address');
        }
        await this.isAccountLocked(user);
        await this.verifyPassword(user, password);
        let passwordExpired = false;
        if (user.passwordChangedAt) {
            const ageMs = Date.now() - new Date(user.passwordChangedAt).getTime();
            const ageDays = ageMs / (1000 * 60 * 60 * 24);
            if (ageDays > PASSWORD_EXPIRY_DAYS) {
                passwordExpired = true;
            }
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            message: 'Login successful',
            token,
            passwordExpired,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    async loginAdmin(credentials) {
        const { email, password } = credentials;

        this.validateEmail(email);
        this.validatePassword(password);

        const admin = await this.userRepository.findByEmail(email.toLowerCase());
        if (!admin || admin.role !== Roles.ADMIN) {
            throw new ValidationException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new ValidationException('Invalid email or password');
        }

        const token = jwt.sign(
            { id: admin._id, name: admin.name, role: admin.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            message: 'Admin login successful',
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        };
    }

    async changePassword(userId, passwordData) {
        const { oldPassword, newPassword } = passwordData;

        this.validatePassword(oldPassword);
        this.validatePassword(newPassword);

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User', userId);
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new ValidationException('Old password is incorrect');
        }

        const history = user.passwordHistory || [];
        for (const oldHash of history.slice(-PASSWORD_HISTORY_LIMIT)) {
            const matched = await bcrypt.compare(newPassword, oldHash);
            if (matched) {
                throw new ValidationException('New password must not match recent passwords');
            }
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const newHistory = (user.passwordHistory || []).concat([hashedNewPassword]).slice(-PASSWORD_HISTORY_LIMIT);
        await this.userRepository.updateById(userId, { password: hashedNewPassword, passwordHistory: newHistory, passwordChangedAt: new Date() });
        return { message: 'Password changed successfully' };
    }

    async getUserProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User', userId);
        }

        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }
}

module.exports = AuthService;
