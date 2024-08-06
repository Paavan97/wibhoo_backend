var nodemailer = require('nodemailer');
const handlebar = require('handlebars');
const fs = require("fs");

const emailHtml = fs.readFileSync('./views/emailhtml.hbs','utf8');

const templete = handlebar.compile(emailHtml);


//----------nodemail core-------------
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pateldevendra3131@gmail.com',
    pass: 'uwuf wtrj gmoy qphs'
  }
});

async function sender(to, subject, otp)
{
    
    var mailOptions = {
        from: 'pateldevendra3131@gmail.com',
        to: `${to}`,
        subject: `${subject}`,
        html: templete({"otp":otp})
    };

    return await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
}


// sender("devendrapatel31415@gmail.com","this is from one function",667788);  //for testing mailsendr


module.exports = sender;