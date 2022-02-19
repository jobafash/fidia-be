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

const testServer   = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: Resolvers
})

const database:UserDocument[] = []

describe("signup endpoint tests", () => {
    before( () => {
        sandbox.stub(User,'create').callsFake( function(doc:any):any{
            const n = Math.ceil(Math.random() * 1000)
            doc._id = String(n)
        
            const user:UserDocument = new User({
                _id: doc._id,
                firstName: doc.firstName,
                lastName: doc.lastName,
                email: doc.email, 
                country: doc.country,
                phoneNumber: doc.phoneNumber,
            })
            
            database.push(user)
            sandbox.stub(user,'sendVerificationMail').callsFake(function() {})
            return user
        })

        sandbox.stub(User,'findOne').callsFake(function(filter:any):any{
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

    it('It should sign up a user successfully when all details are given', (done) => {
        testServer.executeOperation({
            query:`
            mutation signUp($firstName: String!, $lastName: String!, $password: String!, $email:String!, $country: String!, $phoneNumber: String!)
            {
                signUp(firstName:$firstName, lastName:$lastName, email: $email, password:$password, country:$country, phoneNumber: $phoneNumber)
                {
                    _id
                    firstName,
                    lastName,
                    email,
                    country,
                    phoneNumber
                }
            }
            `,
            variables: {
                firstName: users[0].firstName,
                lastName: users[0].lastName,
                email: users[0].email,
                country: users[0].country,
                phoneNumber: users[0].phoneNumber,
                password: 'password'
            }
        })
        .then((res) => {
            const data = res.data?.signUp as UserDocument;
            assert.equal(users[0].email, data.email)
            assert.equal(users[0].firstName, data.firstName)

            //check that database has a new user equal to this user
            assert.equal(database[0]._id, data._id)
            
            done()
        })
    })

    it('It should return error when the user has signed up before', (done) => {
        testServer.executeOperation({
            query:`
            mutation signUp($firstName: String!, $lastName: String!, $password: String!, $email:String!, $country: String!, $phoneNumber: String!)
            {
                signUp(firstName:$firstName, lastName:$lastName, email: $email, password:$password, country:$country, phoneNumber: $phoneNumber)
                {
                    _id
                    firstName,
                    lastName,
                    email,
                    country,
                    phoneNumber
                }
            }
            `,
            variables: {
                firstName: users[0].firstName,
                lastName: users[0].lastName,
                email: users[0].email,
                country: users[0].country,
                phoneNumber: users[0].phoneNumber,
                password: 'password'
            }
        })
        .then((res) => {
            assert.isDefined(res.errors![0])
            const error = res.errors![0]
            const errMessage = error.message
            const errCode = parseInt(error?.extensions?.code as string)

            assert.equal(errMessage, 'User already exists')
            assert.equal(errCode, 400)

            done()
        })
    })
})