import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import User from '../models/User';
import crypto from 'crypto'

const { JWT_SECRET, JWT_EXPIRES, VERIFY_SECRET } = process.env;

//generates jwt access token from user Id.
const generateAccessToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRES,
  });
};

//generates jwt verify token from user Id.
const generateVerifyToken = (id: string): string => {
  return jwt.sign({ id }, VERIFY_SECRET as string, {
    expiresIn: JWT_EXPIRES,
  });

};

//generates jwt verify token from user Id.
const verifyToken = async ( token: string): Promise<string | AppError> => 
{
    const hashedtoken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({verifyToken: hashedtoken})

    
    if(!user)
    {
        return new AppError('User not found', 404);
    }
    
    //if it has expired
    if(Date.now() > (user.verifyTokenExpires as Date).getTime())
    {
        return "Token has expired"
    }

    else
    {
        user.isVerified = true;
        user.verifyToken = null;
        user.verifyTokenExpires = null;
        await user.save()
        return "successfully verified user"
    }

}


const resendVerification = async ( token: string): Promise<string | AppError> => 
{
    const hashedtoken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({verifyToken: hashedtoken})

    
    if(!user)
    {
        return new AppError('User not found', 404);
    }
    
    if(user.isVerified)
        return "User is alredy verified"

    //if it has expired
    if(Date.now() > (user.verifyTokenExpires as Date).getTime())
    {
        user.sendVerificationMail()
        return "New token has been sent to your mail"
    }

    else
    {
        return "Your token is still valid"
    }

}
export { generateAccessToken, generateVerifyToken, verifyToken , resendVerification};