const { Router } = require('express');

const {
  createUser,
  getUsersList,
  getUserById,
  updateUserById,
  deleteUserById,
  getMe,
} = require('../controllers/userControllers');
const { checkUserById, checkCreateUserData, checkUpdateUserData } = require('../middlewares/userMiddlewares');
const { protect, allowFor } = require('../middlewares/authMiddlewares');
const userRolesEnum = require('../constants/userRolesEnum');

const router = Router();

// CRUD = create read update delete
// GET POST PUT PATCH DELETE / OPTIONS

/**
 * REST API
 * POST     /users            - create user
 * GET      /users            - gell all users
 * GET      /users/<userID>   - get one user
 * PUT/PATCH    /users/<userID> - update one user
 * DELETE       /users/<userID> - delete one user
 */
// router.post('/', createUser);
// router.get('/', getUsersList);
// router.get('/:id', checkUserById, getUserById);
// router.patch('/:id', checkUserById, updateUserById);
// router.delete('/:id', checkUserById, deleteUserById);

// Allow only logged in users.
router.use(protect);

// Show logged in user info.
router.get('/me', getMe);

// Roles guard. Allow next routes ONLY for specific roles.
router.use(allowFor(userRolesEnum.ADMIN, userRolesEnum.MODERATOR));

router
  .route('/')
  .post(checkCreateUserData, createUser)
  .get(getUsersList);

router.use('/:id', checkUserById);
router
  .route('/:id')
  .get(getUserById)
  .patch(checkUpdateUserData, updateUserById)
  .delete(deleteUserById);

module.exports = router;
