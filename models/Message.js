const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Message Model Class
class Message {
    // Yangi xabar yaratish (fayl opsional)
    static async create({ from, to, content, fileUrl = null }) {
        await db.read();
        db.data.messages ||= [];
        const msg = {
            id: uuidv4(),
            from,
            to,
            content,
            fileUrl,
            timestamp: Date.now()
        };
        db.data.messages.push(msg);
        await db.write();
        return msg;
    }

    // Ikki user o‘rtasidagi xabarlar (from <-> to)
    static async findBetween(userA, userB) {
        await db.read();
        return (db.data.messages || [])
            .filter(m =>
                (m.from === userA && (m.to === userB || m.to === 'admin')) ||
                (m.to === userA && (m.from === userB || m.from === 'admin'))
            )
            .sort((a, b) => a.timestamp - b.timestamp);
    }
}

module.exports = Message;
