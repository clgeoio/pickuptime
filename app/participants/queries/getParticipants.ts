import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetParticipantsInput
  extends Pick<Prisma.ParticipantFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetParticipantsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: participants,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.participant.count({ where }),
      query: (paginateArgs) => db.participant.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      participants,
      nextPage,
      hasMore,
      count,
    }
  }
)
