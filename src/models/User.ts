import {Document, Schema, Model, model} from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { generateVerifyToken } from '../utils/token'
import sendEmail from '../utils/mailgun'
import crypto from 'crypto'

export interface UserDocument extends Document{
    firstName:string;
    lastName:string;
    email: string;
    password: string;
    phoneNumber: string;
    country: string;
    verifyToken: string | null;
    verifyTokenExpires: Date | null
    isVerified:  boolean;
    sendVerificationMail(): void
}

const userSchema = new Schema<UserDocument>(
    {
        firstName:{
            type:String,
            required:[true,'Firstname is required']
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            validate: [validator.isEmail, 'Email is invalid'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false,
        },
        country: {
            type: String,
            required: [true, 'Please provide a country'],
        },
        phoneNumber:{
            type:String,
            required:[true,'Firstname is required']
        },
        verifyToken: {
            type: String,
        },
        verifyTokenExpires:{
            type: Date
        },
        isVerified:{
            type: Boolean,
            default: false
        }
    },

    { timestamps: true }
)

//hash the password then save to database.
userSchema.pre('save', async function (next) {
    //This would run only if password is actually modified
    if (!this.isModified('password')) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});


userSchema.methods.sendVerificationMail = async function(){

    let token = crypto.randomBytes(16).toString('hex');
  
    this.verifyToken = crypto.createHash('sha256').update(token).digest('hex');
  
    this.verifyTokenExpires = Date.now() + 60 * 60 * 60 * 1000;

    await this.save()

    const DOMAIN:any = process.env.DOMAIN;
    const data = {
        from: process.env.SENDER,
        to: this.email,
        subject: "Hello",
        text: "Testing some Mailgun awesomness!",
        html: `<a>https://fidia.co/auth/verify/${token}</a>`
    }
    sendEmail(DOMAIN, data)
}


const User = model<UserDocument>('User', userSchema)

export default User