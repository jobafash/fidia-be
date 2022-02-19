import {FilterQuery} from 'mongoose'
import User, { UserDocument } from '../models/User'

class Functions{
    static async findOneUser(filter:FilterQuery<UserDocument>, select: string) : Promise<UserDocument | null>
    {
        const user = await User.findOne(filter).select(select)
        return user
    }
     
}


export default Functions