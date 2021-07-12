import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetTimeslotsInput
  extends Pick<Prisma.TimeslotFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTimeslotsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: timeslots,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.timeslot.count({ where }),
      query: (paginateArgs) => db.timeslot.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      timeslots,
      nextPage,
      hasMore,
      count,
    }
  }
)
