import { Post, Prisma } from "@prisma/client"
import { Context } from "../../index"
import { canUserMutatePost } from "../utils/canUserMutatePost"

interface PostArgs {
  post: {
    title?: string
    content?: string
  }
}

interface PostPayloadType {
  userErrors: {
    message: string
  }[]
  post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const postResolvers = {
  // [x] ------------------------------------  CREATE POST
  postCreate: async (
    _: any,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "You must authenticate first!",
          },
        ],
        post: null,
      }
    }

    const { title, content } = post
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "⚠️ You must provide title & content for the post!",
          },
        ],
        post: null,
      }
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: userInfo.userId,
        },
      }),
    }
  },
  // [x] ------------------------------------  UPDATE POST
  postUpdate: async (
    _: any,
    { postId, post }: { postId: string; post: PostArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "You must authenticate first!",
          },
        ],
        post: null,
      }
    }
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    })

    if (error) return error

    const { title, content } = post

    if (!title && !content) {
      return {
        userErrors: [
          {
            message: "At least one field needed!",
          },
        ],
        post: null,
      }
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    })

    // what happens if post DOES NOT exist...
    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "Post does not exist!",
          },
        ],
        post: null,
      }
    }

    let payloadToUpdate = {
      title,
      content,
    }

    if (!title) delete payloadToUpdate.title
    if (!content) delete payloadToUpdate.content

    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          ...payloadToUpdate,
        },
        where: {
          id: Number(postId),
        },
      }),
    }
  },
  // [x] ------------------------------------  DELETE POST
  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "You must authenticate first!",
          },
        ],
        post: null,
      }
    }
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    })

    if (error) return error
    // we have to check if the post exists
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    })

    // what happens if post DOES NOT exist...
    if (!post) {
      return {
        userErrors: [
          {
            message: "Post does not exist!",
          },
        ],
        post: null,
      }
    }

    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    })

    return {
      userErrors: [],
      post,
    }
  },
}
