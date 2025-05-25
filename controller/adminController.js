const User    = require('../models/User');
const Message = require('../models/Message');

// 1. Barcha oddiy userlar ro‘yxati (adminlarni emas)
exports.getUsers = async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Ruxsat yo‘q.' });

    const users = await User.getAll();
    res.json(users);
};

// 2. Admin va tanlangan user o‘rtasidagi xabarlar
exports.getMessages = async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Ruxsat yo‘q.' });

    const userId = req.params.userId;
    // Tekshirish: user mavjudmi
    const user = await User.findById(userId);
    if (!user)
        return res.status(404).json({ msg: 'User topilmadi' });

    const msgs = await Message.findBetween(userId, req.user.id);
    res.json(msgs);
};

// 3. Admindan tanlangan userga xabar yuborish
exports.sendMessage = async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Ruxsat yo‘q.' });

    const from    = req.user.id;
    const to      = req.params.userId;
    const content = req.body.content;
    const file    = req.file;

    if (!content && !file) {
        return res.status(400).json({ msg: 'Matn yoki fayl yuborish kerak.' });
    }

    // Tekshirish: user mavjudmi
    const user = await User.findById(to);
    if (!user)
        return res.status(404).json({ msg: 'User topilmadi' });

    const fileUrl = file ? `/files/${file.filename}` : null;
    const msg = await Message.create({ from, to, content, fileUrl });
    res.json(msg);
};
