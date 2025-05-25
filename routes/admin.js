/**
 * @swagger
 * tags:
 *   - name: Admin Chat
 *     description: Admin uchun user boshqaruv va chat
 *
 * components:
 *   schemas:
 *     UserListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         fullname:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *       example:
 *         id: user-id-123
 *         fullname: Ali Valiyev
 *         email: ali@example.com
 *         role: user
 *     NewMessage:
 *       $ref: '#/components/schemas/NewMessage'
 *     Message:
 *       $ref: '#/components/schemas/Message'
 */

const router = require('express').Router();
const auth   = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const {
    getUsers,
    getMessages,
    sendMessage
} = require('../controller/adminController'); // <-- TO‘G‘RI YO‘L

router.use(auth);

router.get('/users', getUsers);

router.get('/messages/:userId', getMessages);

router.post('/messages/:userId', upload.single('file'), sendMessage);

module.exports = router;
