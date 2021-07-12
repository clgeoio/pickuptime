import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteTimeslot = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteTimeslot), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const timeslot = await db.timeslot.deleteMany({ where: { id } })

  return timeslot
})
