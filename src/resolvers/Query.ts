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
      orderBy: [{ createdAt: "desc" }],
    })
  },
}
