import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateParticipant = z.object({
  name: z.string(),
  timeslotId: z.number(),
  ready: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(CreateParticipant),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const participant = await db.participant.create({ data: input })

    return participant
  }
)
