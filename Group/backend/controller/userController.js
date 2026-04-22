import User from '../models/User.js';

// --- PROFILE FUNCTIONS (For the logged-in user) ---

/**
 * Get the profile of the currently logged-in user
 * Used by ProfilePage.jsx to fetch "Yousef's" data
 */
export const getMe = async (req, res) => {
    try {
        // req.user.id is populated by your 'protect' middleware
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update the profile of a specific user
 * Used by EditProfileForm.jsx to save changes to Atlas
 */
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, // Updates fields like address, city, phone, etc.
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Update failed: " + error.message });
    }
};


// --- ADMIN FUNCTIONS (For the User Management table) ---

/**
 * Get all users for your Admin Table
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Toggle user status (Block/Unblock)
 */
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.status = user.status === 'active' ? 'blocked' : 'active';
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
