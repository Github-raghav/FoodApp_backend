const {APP_PASSWORD}=process.env || require(".././../secret")
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports=async function main(token,userEmail) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
 // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  //kis service k through aapko bejna h.
  let transporter = nodemailer.createTransport({ // transpoter is used to pass configuration
    service:"gmail",
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    auth: {
      user: "araghav621@gmail.com", // generated ethereal user
      pass: APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <contact@gmail.com>', // sender address
    to: userEmail, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Hello world?</b> <p>your reset token is <br>${token}</>`// html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);
