import { Context } from "../index"

export const Query = {
  me: (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null
    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    })
  },
  posts: async (_: any, __: any, { prisma }: Context) => {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [{ createdAt: "desc" }],
    })
  },
  profile: (
    _: any,
    { userId }: { userId: string },
    { prisma, userInfo }: Context
  ) => {
    return prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    })
  },
}
