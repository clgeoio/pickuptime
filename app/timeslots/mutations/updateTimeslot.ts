import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTimeslot = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateTimeslot),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const timeslot = await db.timeslot.update({ where: { id }, data })

    return timeslot
  }
)
