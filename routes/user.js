const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const {
    sendMessage,
    getMessages
} = require('../controller/userController'); // <-- 'controllers'

router.use(auth);

router.post('/messages', upload.single('file'), sendMessage);
router.get('/messages', getMessages);
const { getRole } = require('../controller/authController'); // yoki controllers

// Auth kerak, roleni qaytaradi
router.get('/role', auth, getRole);

module.exports = router;
