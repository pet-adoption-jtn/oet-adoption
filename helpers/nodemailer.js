const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adopt.us.h8@gmail.com',
    pass: process.env.GMAIL_PASS
  }
})

function sendMail (payload) {
  const { recipient, subject, message } = payload
  
  const mailOptions = {
    from: 'adopt.us.h8@gmail.com',
    to: recipient,
    subject: subject,
    html: message
  }
  
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('success');
    }
  })
}

function generateMessage (form_data) {
  return `
  <p style="font-size: 18px;">Hi! Someone want to adopt your pet, please check the form that we sent to assure you.</p><br>
  
  <form style="border: 2px solid black; padding-top: 5px; width: 60%; padding-left: 10px;">
    <h2 style="text-align: center;">REQUEST FOR ADOPTION</h2>
    <label style="font-weight: 600; font-size: 20px;">First Name</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.first_name}</p>

    <label style="font-weight: 600; font-size: 20px;">Last Name</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.last_name}</p>

    <label style="font-weight: 600; font-size: 20px;">Address</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.address}</p>

    <label style="font-weight: 600; font-size: 20px;">Phone Number</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.phone_number}</p>

    <label style="font-weight: 600; font-size: 20px;">Email</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.email}</p>

    <label style="font-weight: 600; font-size: 20px;">Pet Name</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.pet_name}</p>

    <label style="font-weight: 600; font-size: 20px;">How many hours per day would the pet be alone ?</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.hours_pet_alone}</p>

    <label style="font-weight: 600; font-size: 20px;">Will you crate your pet ?</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.crate_pet}</p>

    <label style="font-weight: 600; font-size: 20px;">Do you own any pets ?</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.own_pets}</p>

    <label style="font-weight: 600; font-size: 20px;">Do you own or rent your home ?</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.own_home}</p>

    <label style="font-weight: 600; font-size: 20px;">Do you have a yard ?</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.yard}</p>

    <label style="font-weight: 600; font-size: 20px;">Is there any children at home ?</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.children}</p>

    <label style="font-weight: 600; font-size: 20px;">Have you ever surrended a pet you own to shelter ?</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.surrender_pet}</p>

    <label style="font-weight: 600; font-size: 20px;">Have you ever been convicted of an animal related crime, such as
      cruelty to animals, animal theft, or animal abandonment ?</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.convicted}</p>

    <label style="font-weight: 600; font-size: 20px;">How would you deal with behavioral issues such as barking, chewing,
      destructive behavior, bathroom accidents indoors, unruly leash behaviors in your pet ?</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.behavioral_issues}</p>

    <label style="font-weight: 600; font-size: 20px;">What is your reason to adopt pet ?</label>
    <p style="border-bottom-style: solid; font-size: 18px;">${form_data.reason}</p><br><br>

    <label style="font-weight: 600; font-size: 28px;">Signature,</label><br><br>
    <p style="font-size: 24px; border-bottom-style: solid;">${form_data.signature}</p>
  </form>
  <footer>
    <p style="font-size: 18px;">If you have question, don't hesitate to contact us.</p>
    <p style="font-size: 18px; font-weight: bold;">Contact Us at adopt.us.h8@gmail.com</p>
    
    <p style="font-size: 20px; font-weight: 600;">Sincerely,</p>
    <img src="https://i.imgur.com/ffKv42w.png" width="80" height="80" alt="">
    <p style="font-size: 20px; font-weight: 600; text-decoration: underline;">Adopt.Us</p>
  </footer>
  `
}

module.exports = {
  sendMail,
  generateMessage
}