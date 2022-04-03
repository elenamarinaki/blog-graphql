import { Context } from "../../index"
import validator from "validator"

interface SignupArgs {
  email: string
  name: string
  bio: string
  password: string
}

interface UserPayload {
  userErrors: {
    message: string
  }[]
  user: null
}

export const authResolvers = {
  signup: async (
    _: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const isEmail = validator.isEmail(email)

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "Invalid email",
          },
        ],
        user: null,
      }
    }

    return {
      userErrors: [],
      user: null,
    }

    // return prisma.user.create({
    //   data: {
    //     email,
    //     name,
    //     password,
    //   },
    // })
  },
}
