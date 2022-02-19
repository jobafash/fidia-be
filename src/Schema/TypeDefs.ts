import { gql } from "apollo-server-express";

const TypeDefs = gql`

    type User{
        _id: String!
        firstName: String!
        lastName:  String!
        email: String!
        country: String!
        phoneNumber: String!
    }

    type LoginResponse{
        token: String!
        user: User!
    }

    type Query{
        getAllUsers: [User!]!
    }

    type Mutation{
        signUp(firstName: String!, lastName: String!, password: String!, email:String!, country: String!, phoneNumber: String!):User!
        login(email:String!, password: String!): LoginResponse!
        verifyEmail(token:String!): String!
        resendVerificationMail(token: String!): String!
    }
`

export default TypeDefs