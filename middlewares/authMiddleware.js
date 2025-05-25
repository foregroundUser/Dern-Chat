require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = "f5bbb043ddcd8bf829e8264c89221666b11db895bec0754d7a91af566e4fc0675e8d762bdaf2775e4a4df13e7fb759cf293afb3c6ed2049ab795ff864f078fdafcde4669b05e7b042f0032a6f8a1f78ec47e87e5186dd383e8dc4922d66fa5b7c66d5b359ba7ba040fcbf064957257138a1b485ba4c2b952bbd2608548d8707588fb640f9b634cf97f60979c15dc6a23fc56512766fd85b1d38b99b37723c335323e6cf1ce3f5a96ecf552305b1d84555571acf95cc8a9cfeb4e7f3eb20136065099b845f36b589644ff47f81a4c539a8e80fbc89415f593a11589be37ac402e4f920eaab56499524be0d255847b383099b55fd74edfa501a34f970402222f47";

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers['x-access-token'];
    console.log('⚙️ Authorization header:', authHeader);

    if (!authHeader) {
        return res.status(401).json({ msg: 'Token yo‘q.' });
    }

    // Bearer prefiksini yo'qotib, faqat tokenni ajratib olamiz
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    console.log('🔑 Token extracted:', token);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ JWT decoded:', decoded);
        req.user = decoded;   // { id, role, iat, exp }
        next();
    } catch (err) {
        console.error('❌ JWT Error:', err.message);
        return res.status(403).json({ msg: 'Token noto‘g‘ri yoki muddati o‘tgan.' });
    }
};
