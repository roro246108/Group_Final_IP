import express from 'express';
import { getMe, updateUser, getAllUsers, toggleUserStatus } from '../controller/userController.js';
import { protect, isAdmin } from '../MiddleWares/auth.js';

const router = express.Router();

// --- PERSONAL PROFILE ROUTES ---

// Route to get the currently logged-in user's profile
// Frontend calls: GET http://localhost:5050/api/users/me
router.get('/me', protect, getMe);

// Route to update a specific user profile
// Frontend calls: PUT http://localhost:5050/api/users/:id
router.put('/:id', protect, updateUser);


// --- ADMIN MANAGEMENT ROUTES ---

// Route to get all users (This populates your admin table)
router.get('/all', protect, isAdmin, getAllUsers);

// Route to block/unblock (Triggered by your table buttons)
router.patch('/toggle-status/:id', protect, isAdmin, toggleUserStatus);

export default router;
