const Admin = require("../models/Admin");
const AuthService = require("../services/authService");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findAdminByEmail(email);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const valid = await AuthService.comparePassword(
            password,
            admin.password_hash
        );

        if (!valid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = AuthService.generateToken(admin);

        return res.json({
            success: true,
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

module.exports = {
    login
};