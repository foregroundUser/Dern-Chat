const db = require('../config/db.js');
const { v4: uuidv4 } = require('uuid');

class User {
    static async create({ fullname, email, passwordHash, role }) {
        await db.read();
        db.data.users ||= [];
        const newUser = {
            id: uuidv4(),
            fullname,
            email,
            password: passwordHash,
            role
        };
        db.data.users.push(newUser);
        await db.write();
        return newUser;
    }

    static async findByEmail(email) {
        await db.read();
        return db.data.users.find(u => u.email === email);
    }

    static async getAll() {
        await db.read();
        // faqat oddiy userlar (adminlarni emas)
        return db.data.users.filter(u => u.role !== 'admin');
    }

    static async findById(id) {
        await db.read();
        return db.data.users.find(u => u.id === id);
    }
}

module.exports = User;
