/* global Helpers */
const { userAction } = require('../../action');

const createTransaction = async (req, res) => {
  try {
    req.checkBody({
      userId: { notEmpty: true, errorMessage: 'userId is Required' },
      items: { notEmpty: true, errorMessage: 'items is Required' },
      totalPrice: { notEmpty: true, errorMessage: 'totalPrice is Required' }
    });
    req.checkHeaders({
      token: { notEmpty: true, errorMessage: 'token is Required' },
    });
    const errors = req.validationErrors();
    if (errors) {
      return Helpers.error(res, errors);
    };

    let items = []
    
    const jwtObj = await Helpers.jwtVerify(req.headers.token, config.get('JWT_SECRET_KEY'));

    req.body.items.forEach( item => {
      items.push(`${item.title}: $${item.price}`);
    });

    await userAction.updateOne({ _id: jwtObj.userId }, {
      transaction: [{items: req.body.items, totalPrice: req.body.totalPrice}]
    });

    const mailerTransport = config.get("MAILER_TRANSPORT");
    const mailOptions = {
      from: '"VinStore ltd"<treasurecredit@gmail.com>',
      to: jwtObj.email,
      subject: 'VINvoice',
      html: `<b> Your invoice:<br>
                  Items: ${items}<br>
                  Total Price: $${req.body.totalPrice}<br>
            </b>`
    };

    await Helpers.sendMail(mailerTransport, mailOptions);

    const user = await userAction.create(req.body);
    const result = await userAction.generateWebToken(user);

    return Helpers.response(res, result);
  } catch (error) {
    return Helpers.error(res, error);
  }
};

module.exports = (router) => {
  router.post('/create', createTransaction);
};
