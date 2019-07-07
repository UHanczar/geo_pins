const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    _id: ID
    name: String
    email: String
    picture: String
  }
  
  type Pin {
    _id: String
    createdAt: String
    title: String
    content: String
    image: String
    latitude: Float
    longitude: Float
    author: User
    comments: [Comment]
  }
  
  type Comment {
    _id: String
    createdAt: String
    text: String
    author: User
  }
  
  input CreatePinInput {
    title: String
    image: String
    content: String
    latitude: Float
    longitude: Float
  }
  
  type Query {
    me: User
    getPins: [Pin!]
  }
  
  type Mutation {
    createPin(input: CreatePinInput!): Pin
    deletePin(pinId: ID!): Pin
    createComment(pinId: ID!, text: String): Pin
  }
`;
