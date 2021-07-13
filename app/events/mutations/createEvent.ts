import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateEvent = z.object({
  name: z.string(),
  date: z.date(),
  timeslots: z.array(
    z.object({
      date: z.date(),
    })
  ),
})

export default resolver.pipe(resolver.zod(CreateEvent), resolver.authorize(), async (input) => {
  const event = await db.event.create({
    data: {
      ...input,
      timeslots: {
        create: input.timeslots,
      },
    },
  })

  return event
})
