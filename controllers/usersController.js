const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')
var FB = require('fb')

class UserController {
  static registerUser(req, res){
    // console.log(req.body);
    const saltUser = bcrypt.genSaltSync(8)
    const hashedPassword = bcrypt.hashSync(req.body.password, saltUser)
    User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hashedPassword,
      salt: saltUser
    }, function(err, user){
      console.log(user);
      if (!err){
        const tokenUser = jwt.sign({
          id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          isAdmin: user.isAdmin
        }, process.env.JWT_SECRET_KEY)
        console.log(tokenUser);
        res.status(200).json({token: tokenUser, userId: user._id, first_name: user.first, last_name: user.last_name, isAdmin: user.isAdmin })
      }
    })
  }
  static addTransaction(req, res){
    // console.log(req.body);
    let decoded = jwt.verify(req.body.token, process.env.JWT_SECRET_KEY);
    let items = []
    req.body.items.forEach(item=>{
      items.push(`${item.title}: $${item.price}`)
    })
    User.updateOne({ _id: decoded.userId },{
      transaction: [{items: req.body.items, totalPrice: req.body.totalPrice}]
    })
    .then(done=>{
      // console.log(done);
      let transporter = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth:{
          user:'treasurecredit@gmail.com',
          pass:'pairproject'
        }
      })
      // console.log(transporter);
      let mailOptions = {
        from:'"VinStore ltd"<treasurecredit@gmail.com>',
        to: decoded.email,
        subject: 'VINvoice',
        html: `<b> Your invoice:<br>
                    Items: ${items}<br>
                    Total Price: $${req.body.totalPrice}<br>
              </b>`
      };
      // console.log(mailOptions);
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
          res.status(400).json(error)
        }
        // res.alert('account registration confirmation has been sent via email!')
        console.log('Message %s sent: %s',info.messageId,info.response);
      })
      res.status(200).json(done)
      // res.redirect(`/customer/${req.params.id}`)
    })
    .catch(err=>{
      res.status(400).json('error')
    })
  }
  static getUsers(req, res){
    User.find({},function(err, users){
      res.status(200).json(users)
    })
  }
  static login(req, res){
    User.findOne({ email: req.body.email})
    .then(user => {
      const passwordCheck = bcrypt.compareSync(req.body.password, user.password)
      // console.log(user.password);
      // console.log(passwordCheck);
      if (passwordCheck) {
        const tokenUser = jwt.sign({
          id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          isAdmin: user.iAdmin
        }, process.env.JWT_SECRET_KEY)
        console.log(tokenUser);
        res.status(200).json({token: tokenUser, userId: user._id, first_name: user.first_name, last_name: user.last_name, isAdmin: user.isAdmin })
        // req.headers.token = tokenUser
      }else {
        res.status(200).json('wrong password')
      }
    })
    .catch(err=>{
      res.status(200).json('email is not found')
    })
  }
  static fbLogin(req, res){
    FB.api('me', { fields: ['id', 'name', 'email', 'first_name', 'last_name'], access_token: `${req.body.token}` }, function (resFb) {
      console.log('resfb------>',resFb);
      User.find({ email: resFb.email }, function (err, regist) {
        // console.log(regist);
        if (regist[0].email !== resFb.email) {
          const saltUser = bcrypt.genSaltSync(8)
          const hashedPassword = bcrypt.hashSync(`${resFb.first_name}123`, saltUser)
          User.create({
            first_name: resFb.first_name,
            last_name: resFb.last_name,
            email: resFb.email,
            password: hashedPassword,
            salt: saltUser
          }, function(err, user){
            if (!err){
              const tokenUser = jwt.sign({
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
              }, process.env.JWT_SECRET_KEY)
              console.log(tokenUser);
              res.status(200).json({token: tokenUser, userId: user._id, first_name: user.first_name, last_name: user.last_name, isAdmin: user.isAdmin })
            }
          })
        }else if(regist[0].email === resFb.email){
          const tokenUser = jwt.sign({
            id: regist[0]._id,
            email: regist[0].email,
            first_name: regist[0].first_name,
            last_name: regist[0].last_name
          }, process.env.JWT_SECRET_KEY)
          console.log(regist);
          console.log('tokenasdasd',tokenUser);
          res.status(200).json({token: tokenUser, userId: regist[0]._id, first_name: regist[0].first_name, last_name: regist[0].last_name })
          // req.headers.token = tokenUser
        }
      });
    });
  }
}

module.exports = UserController
