const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');



exports.register = async (req, res) => {
    const { fullname, email, password } = req.body;
    const role = req.body.role || 'user';

    if (!fullname || !email || !password) {
        return res
            .status(400)
            .json({ msg: 'fullname, email va password kerak.' });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
        return res
            .status(400)
            .json({ msg: 'Bu email allaqachon ro‘yxatdan o‘tgan.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullname, email, passwordHash: hash, role });

    const token = jwt.sign({ id: user.id, role: user.role }, "f5bbb043ddcd8bf829e8264c89221666b11db895bec0754d7a91af566e4fc0675e8d762bdaf2775e4a4df13e7fb759cf293afb3c6ed2049ab795ff864f078fdafcde4669b05e7b042f0032a6f8a1f78ec47e87e5186dd383e8dc4922d66fa5b7c66d5b359ba7ba040fcbf064957257138a1b485ba4c2b952bbd2608548d8707588fb640f9b634cf97f60979c15dc6a23fc56512766fd85b1d38b99b37723c335323e6cf1ce3f5a96ecf552305b1d84555571acf95cc8a9cfeb4e7f3eb20136065099b845f36b589644ff47f81a4c539a8e80fbc89415f593a11589be37ac402e4f920eaab56499524be0d255847b383099b55fd74edfa501a34f970402222f47", {
        expiresIn: '365d'
    });

    res.json({ token });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ msg: 'email va password kerak.' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
        return res
            .status(400)
            .json({ msg: 'email yoki parol noto‘g‘ri.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res
            .status(400)
            .json({ msg: 'email yoki parol noto‘g‘ri.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "f5bbb043ddcd8bf829e8264c89221666b11db895bec0754d7a91af566e4fc0675e8d762bdaf2775e4a4df13e7fb759cf293afb3c6ed2049ab795ff864f078fdafcde4669b05e7b042f0032a6f8a1f78ec47e87e5186dd383e8dc4922d66fa5b7c66d5b359ba7ba040fcbf064957257138a1b485ba4c2b952bbd2608548d8707588fb640f9b634cf97f60979c15dc6a23fc56512766fd85b1d38b99b37723c335323e6cf1ce3f5a96ecf552305b1d84555571acf95cc8a9cfeb4e7f3eb20136065099b845f36b589644ff47f81a4c539a8e80fbc89415f593a11589be37ac402e4f920eaab56499524be0d255847b383099b55fd74edfa501a34f970402222f47", {
        expiresIn: '1h'
    });

    res.json({ token });
};


exports.getRole = (req, res) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ msg: 'Not authenticated' });
    }

    res.json({
        id: req.user.id,
        role: req.user.role,
        fullname: req.user.fullname || null,
        email: req.user.email || null
    });
};

