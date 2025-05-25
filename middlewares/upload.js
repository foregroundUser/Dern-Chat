const multer  = require('multer');
const path    = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../files'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        // Unikal va toza nom (va ext har doim bor)
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
    }
});

module.exports = multer({ storage });
