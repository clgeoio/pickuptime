import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTimeslot = z.object({
  id: z.number(),
  eventId: z.number(),
  name: z.string(),
  participants: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      ready: z.boolean(),
    })
  ),
})

export default resolver.pipe(
  resolver.zod(UpdateTimeslot),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const timeslot = await db.timeslot.update({
      where: { id },
      data: {
        ...data,
        participants: {
          upsert: data.participants.map((participant) => ({
            where: { id: participant.id || 0 },
            create: { ...participant, eventId: data.eventId },
            update: participant,
          })),
        },
      },
    })

    return timeslot
  }
)
