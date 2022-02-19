import dotenv from 'dotenv'
dotenv.config()
import formData from 'form-data'
import Mailgun from 'mailgun.js'
const mailgun = new Mailgun(formData);
const key:any = process.env.MAILGUN_API_KEY;
const mg = mailgun.client({username: 'jobafash', key: key });

const sendEmail = (DOMAIN: string, data: any) => {
    mg.messages.create(DOMAIN, data)
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err))
}

export default sendEmail