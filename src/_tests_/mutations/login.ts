process.env.NODE_ENV = 'test'
import chai from 'chai'
import sinon from 'sinon'
import User, { UserDocument } from '../../models/User'
import users from '../mocks/users'
import { ApolloServer } from 'apollo-server-express'
import TypeDefs from '../../Schema/TypeDefs'
import Resolvers from '../../Schema/Resolvers'
const assert = chai.assert
const sandbox = sinon.createSandbox()
import bcrypt from 'bcryptjs'
import Functions from '../../utils/Functions'

const testServer   = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: Resolvers
})

const database:UserDocument[] = []
describe("Tests for the login endpoint",() => {
    before(async () => {
        //creat ! new user
        const n = Math.ceil(Math.random() * 1000)
        const user = users[0]
        const password = await bcrypt.hash('password', 10) 
        const newUser:UserDocument = new User({
            _id: String(n),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email, 
            country: user.country,
            phoneNumber: user.phoneNumber,
            password,
            isVerified: false
        })
        
        database.push(newUser)

        //stub the findOne function.

        sandbox.stub(Functions,'findOneUser').callsFake(async function(filter:any,select: any):Promise<any>{
            let ans = null
            for(const data of database)
            {
                if (data.email === filter.email)
                {
                    ans = data
                    break
                }
            }

            return ans
        })
    })

    after(() => {
        sandbox.restore()
    })

    it('It should throw error when a user is unverified', (done) => {
        testServer.executeOperation({
            query:`
            mutation login($password: String!, $email:String!)
            {
                login(email: $email, password:$password)
                {
                    token,
                    user {
                        firstName,
                        lastName,
                        email
                    }
                }
            }
            `,
            variables: {
                email: users[0].email,
                password: 'password'
            }
        })
        .then((res)=>{
            assert.isDefined(res.errors![0])
            const error = res.errors![0]
            const errMessage = error.message
            const errCode = parseInt(error?.extensions?.code as string)

            assert.equal(errMessage, 'User is unverified')
            assert.equal(errCode, 401)           
            done()
        })
    })
    
})