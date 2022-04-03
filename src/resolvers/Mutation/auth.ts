import { Context } from "../../index"
import validator from "validator"

interface SignupArgs {
  email: string
  name: string
  bio: string
  password: string
}
export const authResolvers = {
  signup: (
    _: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ) => {},
}
