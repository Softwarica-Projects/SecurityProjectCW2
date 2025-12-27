const express = require('express');
const AdminController = require('../controllers/adminController');
const User = require('../models/userModel');
const { authenticateToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const Roles = require('../enums/roles.enum');

const router = express.Router();
const adminController = new AdminController(User);

router.get('/list', authenticateToken, roleMiddleware('admin'), adminController.getAdmins.bind(adminController));

router.delete('/:adminId', authenticateToken, roleMiddleware('admin'), adminController.deleteAdmin.bind(adminController));

router.patch('/:adminId', authenticateToken, roleMiddleware('admin'), adminController.updateAdmin.bind(adminController));

router.get('/all-users', adminController.getAllUsers.bind(adminController));

router.post('/add-admin', authenticateToken, roleMiddleware(Roles.ADMIN), adminController.addAdmin.bind(adminController));
module.exports = router;