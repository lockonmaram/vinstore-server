/* global Helpers */
const { userAction } = require('../../action');

const registerUser = async (req, res) => {
  try {
    req.checkBody({
      first_name: { notEmpty: true, errorMessage: 'first_name is Required' },
      last_name: { notEmpty: true, errorMessage: 'last_name is Required' },
      email: { notEmpty: true, errorMessage: 'email is Required' },
      password: { notEmpty: true, errorMessage: 'password is Required' }
    });
    const errors = req.validationErrors();
    if (errors) {
      return Helpers.error(res, errors);
    }

    const user = await userAction.create(req.body);
    const result = await userAction.generateWebToken(user);

    return Helpers.response(res, result);
  } catch (error) {
    return Helpers.error(res, error);
  }
};

const login = async (req, res) => {
  try {
    req.checkBody({
      email: { notEmpty: true, errorMessage: 'email is Required' },
      password: { notEmpty: true, errorMessage: 'password is Required' }
    });
    const errors = req.validationErrors();
    if (errors) {
      return Helpers.error(res, errors);
    }

    const getUser = await userAction.getOne({ email: req.body.email });
    if (!getUser) {
      return Helpers.response(res, { message: 'email is not found' });
    };

    const verifyPassword = await userAction.verifyPassword(req.body, getUser);
    if (!verifyPassword) {
      return Helpers.response(res, { message: 'wrong password' });
    };

    const result = await userAction.generateWebToken(getUser);

    return Helpers.response(res, result);
  } catch (error) {
    return Helpers.error(res, error);
  }
};

const getByEmail = async (req, res) => {
  try {
    req.checkBody({
      email: { notEmpty: true, errorMessage: 'email is Required' },
    });
    const errors = req.validationErrors();
    if (errors) {
      return Helpers.error(res, errors);
    }

    const result = await userAction.getOne(req.body);

    return Helpers.response(res, result);
  } catch (error) {
    return Helpers.error(res, error);
  }
};

module.exports = (router) => {
  router.post('/register', registerUser);
  router.post('/login', login);
  router.post('/email', getByEmail);
};
