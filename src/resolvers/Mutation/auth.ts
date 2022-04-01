import { Context } from "../../index"

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
