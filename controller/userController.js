const Message = require('../models/Message');
const db = require('../config/db');

// Xabar yuborish
exports.sendMessage = async (req, res) => {
    try {
        const from    = req.user.id;
        let   to      = req.body.to; // to ni har doim clientdan olishga harakat qil
        const content = req.body.content;
        const file    = req.file;

        if (!content && !file) {
            return res.status(400).json({ msg: 'Matn yoki fayl yuborish kerak.' });
        }

        // Default: agar to yo‘q bo‘lsa, adminni top
        if (!to) {
            await db.read();
            const adminUser = db.data.users.find(u => u.role === 'admin');
            to = adminUser ? adminUser.id : 'admin';
        }

        const fileUrl = file ? `/files/${file.filename}` : null;
        const msg = await Message.create({ from, to, content, fileUrl });
        res.json(msg);
    } catch (e) {
        res.status(500).json({ msg: 'Serverda xatolik', error: e.message });
    }
};

// Xabarlarni olish (user va admin o‘rtasida)
exports.getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        // Adminni topish
        await db.read();
        const adminUser = db.data.users.find(u => u.role === 'admin');
        const adminId = adminUser ? adminUser.id : 'admin';

        const msgs = await Message.findBetween(userId, adminId);
        res.json(msgs);
    } catch (e) {
        res.status(500).json({ msg: 'Serverda xatolik', error: e.message });
    }
};
