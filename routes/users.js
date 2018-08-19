var express = require('express');
var router = express.Router();
var userController = require('../controllers/usersController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/signup', userController.registerUser)
router.post('/login', userController.login)
router.put('/addTransaction', userController.addTransaction)
router.post('/fblogin', userController.fbLogin)


module.exports = router;
