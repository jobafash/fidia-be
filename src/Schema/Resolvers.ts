import User, { UserDocument } from "../models/User"
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateVerifyToken, resendVerification, verifyToken } from './../utils/token'
import { AppError } from "../errors/AppError"
import Functions from '../utils/Functions'



const Resolvers = {
    Query: {
        async getAllUsers(){
            const allUsers:UserDocument[] = await User.find({})
            return allUsers
        }
    },

    Mutation: {
        async signUp(parent:any, args:any): Promise<UserDocument | Error> {
            const {firstName, lastName, password, email, country, phoneNumber} = args
            const userExists = await User.findOne({ email })
            if(userExists) return new AppError('User already exists', 400)
            const user = await User.create({
                firstName,
                lastName,
                email,
                password,
                country,
                phoneNumber
            })

            user.sendVerificationMail();

            return user
        },

        async login(parent:any, args:any): Promise<{ token:string, user:UserDocument } | Error> {
            const { password, email } = args
            const user = await Functions.findOneUser({ email },'+password')
            if(!user) return new AppError('User not found', 404)
            if(!user.isVerified) return new AppError('User is unverified', 401)
            const check = await bcrypt.compare(password, user.password)
            if(!check) return new AppError('Invalid email or password', 401)

            const token = generateAccessToken(user._id)

            return { token, user }
        },


        async verifyEmail(parent:any, args:any): Promise<string | AppError> {
            const { token } = args
            const result = await verifyToken(token)
            return result
        },

        async resendVerificationMail(parents:any, args: any): Promise<string | AppError>{
            const result = await resendVerification(args.token)
            return result
        }
    }
}

export default Resolvers