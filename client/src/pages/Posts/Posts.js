import React from "react"
import Post from "../../components/Post/Post"
import { gql } from "@apollo/client"

const GET_POSTS = gql`
  query {
    posts {
      title
      content
      createdAt
      user {
        name
      }
    }
  }
`

export default function Posts() {
  return <div></div>
}
