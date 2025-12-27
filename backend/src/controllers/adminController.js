const bcrypt = require('bcrypt');
const Roles = require('../enums/roles.enum');

class AdminController {
    constructor(User) {
        this.User = User;
    }

    async getAdmins(req, res) {
        try {
            const admins = await this.User.find({ role: 'admin' }).select('-password');
            res.status(200).json({ admins });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteAdmin(req, res) {
        try {
            const { adminId } = req.params;
            const admin = await this.User.findByIdAndDelete(adminId);
            if (!admin || admin.role !== 'admin') {
                return res.status(404).json({ message: 'Admin not found' });
            }

            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateAdmin(req, res) {
        try {
            const { adminId } = req.params;
            const { name, email } = req.body;
            const admin = await this.User.findById(adminId);
            if (!admin || admin.role !== 'admin') {
                return res.status(404).json({ message: 'Admin not found' });
            }
            if (name) admin.name = name;
            if (email) admin.email = email;

            await admin.save();
            res.status(200).json({ message: 'Admin updated successfully', admin });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async changeAdminPassword(req, res) {
        try {
            const { adminId } = req.params;
            const { newPassword } = req.body;
            const admin = await this.User.findById(adminId);
            if (!admin || admin.role !== 'admin') {
                return res.status(404).json({ message: 'Admin not found' });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            admin.password = hashedPassword;
            await admin.save();

            res.status(200).json({ message: 'Admin password updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.User.find().select('-password');
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async addAdmin(req, res) {
        const { name, email, password } = req.body;

        try {
            const existingUser = await this.User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = new this.User({ name, email, password: hashedPassword, role: Roles.ADMIN });
            await newAdmin.save();

            res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

}

module.exports = AdminController;