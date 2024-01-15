import { db } from "./db";
import { getSelf } from "./auth-service";

export async function getRecommended() {
  let userId;
  let users = [];
  try {
    const self = await getSelf();
    userId = self.id;
  } catch (e) {
    userId = null;
  }

  if (userId) {
    users = await db.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: userId,
            },
          },
          {
            NOT: {
              followedBy: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
          {
            NOT: {
              blocking: {
                some: {
                  blockedId: userId,
                },
              },
            },
          },
        ],
      },
      include: {
        stream: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    users = await db.user.findMany({
      include: {
        stream: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return users;
}
