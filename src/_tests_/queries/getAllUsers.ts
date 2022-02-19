process.env.NODE_ENV = 'test'
import chai from 'chai'
import sinon from 'sinon'
import User, { UserDocument } from '../../models/User'
import users from '../mocks/users'
import {FilterQuery} from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import TypeDefs from '../../Schema/TypeDefs'
import Resolvers from '../../Schema/Resolvers'
const assert = chai.assert

const testServer   = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: Resolvers
})
let stub:any
describe('Get all users query', () => {
  before(() => {
    stub = sinon.stub(User,'find').callsFake(function(filter:FilterQuery<UserDocument>):any{
      return users as UserDocument[]
    })
  })

  after(() => {
    stub.restore()
  })

  it('It should return a list of all users', (done) => {
      testServer.executeOperation({
        query:`
        query{
          getAllUsers{
            email,
            firstName,
            lastName,
            country,
            phoneNumber
          }
        }
        `
      }).then((data) => {
        let result = data.data
        assert.property(result,'getAllUsers')
        result = result?.getAllUsers as UserDocument[]

        assert.equal(users.length, result?.length)
        const n = users.length
        for(let i = 0; i < n; i++)
        {
          const one = users[i] as UserDocument;
          const two = result[i];
          assert.equal(one.email, two.email)
          assert.equal(one.firstName, two.firstName)
          assert.equal(one.lastName, two.lastName)
          assert.equal(one.country, two.country)
          assert.equal(one.phoneNumber, two.phoneNumber)
        }
        done()
      })
      
  })  
})