const nodemailer = require('nodemailer');
const clientUrl = `${process.env.CLIENT_URL}`


module.exports = {
    nodeMailer : function(email, type) {
        console.log('ini email kirim',email, type);
        console.log('ini email admin', process.env.NODE_MAILER_USER);
        console.log('ini pass admin', process.env.NODE_MAILER_PASS);
        
        
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: `${process.env.NODE_MAILER_USER}`, // generated ethereal user
            pass: `${process.env.NODE_MAILER_PASS}` // generated ethereal password
            }

        });
        let info = {
        from: `"TanyaAja" <${process.env.NODE_MAILER_USER}>`, // sender address
        to: `${email}`, // list of receivers
        subject: "ALERT", // Subject line
        html: `
            <h1> WELCOME TO TanyaAja </h1>
            <h4> Your comfortable discussion group for almost anything and accessible to all of the people in the world</h4>
            <a href="${clientUrl}"> Check TanyaAja app to know latest discussion <a>`
        }
        console.log('ini info yg dibuat', info);
        
        return new Promise(( res, rej )=>{
            transporter.sendMail(info)
            .then(data =>{
                res(data)
            })
            .catch(err =>{
                rej(err)
            })
        }) 
    }
}