var nodemailer = require('nodemailer');
function mymail(email,pass,cb)
{
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'phpbatch34@gmail.com',
    pass: '123@@123'
  }
});

var mailOptions = {
  from: 'phpbatch34@gmail.com',
  to: email,
  subject: 'verification mail',
  html:"<h1>welcome to postkrde.com</h1><br>you have registered successfully, your login credentials are <br><br>Username: "+email+"<br>Password: "+pass+"<h1>Click on link below to verify account</h1><br><br> http://localhost:3000/verify?email="+email

};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    cb(true)
  }
}); 
}
module.exports={mymail:mymail}