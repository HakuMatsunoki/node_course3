const { Router } = require('express');

const { createTodo, getTodosList } = require('../controllers/todoController');
const { protect } = require('../middlewares/authMiddlewares');

const router = Router();

router.use(protect);

router.post('/', createTodo);
router.get('/', getTodosList);

module.exports = router;
