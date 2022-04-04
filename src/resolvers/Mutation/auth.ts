import { Context } from "../../index"
import validator from "validator"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import { JSON_SIGNATURE } from "../../keys"

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
  token: string | null
}

export const authResolvers = {
  signup: async (
    _: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    // ::----------------------------- EMAIL validation
    const isEmail = validator.isEmail(email)

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "Invalid email",
          },
        ],
        token: null,
      }
    }

    // ::----------------------------- PASSWORD validation
    const isValidPassword = validator.isLength(password, {
      min: 5,
    })

    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "Invalid password",
          },
        ],
        token: null,
      }
    }

    // :: hashing the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // ::----------------------------- simple name & bio check
    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "Invalid name or bio",
          },
        ],
        token: null,
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    const token = await JWT.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JSON_SIGNATURE,
      {
        expiresIn: 3600000,
      }
    )

    return {
      userErrors: [],
      token,
    }
  },
}
