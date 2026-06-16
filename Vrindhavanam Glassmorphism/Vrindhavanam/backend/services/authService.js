const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

function generateToken(admin) {
    return jwt.sign(
        {
            id: admin.id,
            email: admin.email,
            role: admin.role
        },
        "VRINDHAVANAM_SECRET_KEY",
        {
            expiresIn: "7d"
        }
    );
}

module.exports = {
    comparePassword,
    generateToken
};