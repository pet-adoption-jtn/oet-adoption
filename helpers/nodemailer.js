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
  
  <form style="border: 1px solid rgba(0,0,0,.125); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; padding-top: 5px; width: 60%; padding-left: 30px; border-radius: .25rem;padding-right: 30px;">
    <h2 style="text-align: center;">REQUEST FOR ADOPTION</h2>
    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block;">First Name</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.first_name}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Last Name</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.last_name}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Address</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.address}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Phone Number</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.phone_number}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Email</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.email} </p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Pet Name</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.pet_name}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">How many hours per day would the pet be alone ?</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.hours_pet_alone}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Will you crate your pet ?</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.crate_pet}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Do you own any pets ?</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.own_pets}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Do you own or rent your home ?</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.own_home}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Do you have a yard ?</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.yard}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Is there any children at home ?</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.children}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Have you ever surrended a pet you own to shelter ?</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.surrender_pet}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Have you ever been convicted of an animal related crime, such as
      cruelty to animals, animal theft, or animal abandonment ?</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.convicted}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">How would you deal with behavioral issues such as barking, chewing,
      destructive behavior, bathroom accidents indoors, unruly leash behaviors in your pet ?</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.behavioral_issues}</p>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">What is your reason to adopt pet ?</label>
    <p style="border-bottom-style: solid; font-size: 18px; border-width: 0.2px; border-color: grey;">${form_data.reason}</p><br><br>

    <label style="font-weight: 600; font-size: 20px; margin-top: 20px; display: inline-block">Signature,</label><br><br>
    <p style="font-size: 24px; border-bottom-style: solid; border-width: 0.2px; border-color: grey;">${form_data.signature}</p>
  </form>

  <footer>
    <p style="font-size: 18px; ">If you have question, don't hesitate to contact us.</p>
    <p style="font-size: 18px; font-weight: bold;">Contact Us at adopt.us.h8@gmail.com</p>
    
    <p style="font-size: 20px; font-weight: 600;">Sincerely,</p>
    <img src="https://i.imgur.com/ffKv42w.png" width="80" height="80" alt="">
    <p style="font-size: 20px; font-weight: 600; text-decoration: underline;">Adopt.Us</p>
  </footer>
  `
}

function generateMessageApproval ({ name, breed, color }) {
  return `
    <p style="font-size: 16px;">Hi! This is the answer for your request to Adopt.Us</p>

    <div style="text-align: justify; width: 60%; border: 1px solid grey; padding-right: 20px; padding-left: 20px; background-color: #fff; color: #000; border-radius: 5px; font-size: 16px;">
    <p>We have received your request to adopt <strong>${name}</strong> the <strong>${breed}</strong> with <strong>${color}</strong> color on our platform. We gladly announce you that your request has been <strong style="color: #ab0b6b; text-decoration: underline;">APPROVED</strong> by pet owner. We wish you happy and have a good life with your new pet. Thank you for using our platform.</p>
    </div>

    <footer>
      <p style="font-size: 16px; ">If you have question, don't hesitate to contact us.</p>
      <p style="font-size: 16px; font-weight: bold;">Contact Us at adopt.us.h8@gmail.com</p>
      
      <p style="font-size: 16px; font-weight: 600;">Sincerely,</p>
      <img src="https://i.imgur.com/ffKv42w.png" width="60" height="60" alt="">
      <p style="font-size: 16px; font-weight: 600; text-decoration: underline;">Adopt.Us</p>
    </footer>
  `
}

function generateMessageDecline ({ name, breed, color }) {
  return `
    <p style="font-size: 16px;">Hi! This is the answer for your request to Adopt.Us</p>

      <div style="text-align: justify; width: 60%; border: 1px solid grey; padding-right: 20px; padding-left: 20px; background-color: #fff; color: #000; border-radius: 5px; font-size: 16px;">
      <p>We have received your request to adopt <strong>${name}</strong> the <strong>${breed}</strong> with <strong>${color}</strong> color on our platform. We sadly announce you that your request has been <strong style="color: red; text-decoration: underline;">DECLINED</strong> by pet owner. You can try again in another time and please fill the adoption form correctly. Thank you for using our platform.</p>
      </div>

      <footer>
        <p style="font-size: 16px; ">If you have question, don't hesitate to contact us.</p>
        <p style="font-size: 16px; font-weight: bold;">Contact Us at adopt.us.h8@gmail.com</p>
        
        <p style="font-size: 16px; font-weight: 600;">Sincerely,</p>
        <img src="https://i.imgur.com/ffKv42w.png" width="60" height="60" alt="">
        <p style="font-size: 16px; font-weight: 600; text-decoration: underline;">Adopt.Us</p>
      </footer>
  `
}

module.exports = {
  sendMail,
  generateMessage,
  generateMessageApproval,
  generateMessageDecline
}