import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import Pusher from "pusher"

const CreateParticipant = z.object({
  name: z.string(),
  timeslotId: z.number(),
  eventId: z.string(),
  ready: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(CreateParticipant),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const participant = await db.participant.create({ data: input })

    return participant
  },
  (participant) => {
    if (participant.eventId && process.env.PUSHER_SECRET) {
      const pusher = new Pusher({
        appId: "1236902",
        key: "95fbbd446a25b7ad3518",
        secret: process.env.PUSHER_SECRET,
        cluster: "ap4",
        useTLS: true,
      })

      pusher.trigger(`public-${participant.eventId}`, "participantChange", {
        id: participant.eventId,
      })
    }
    return participant
  }
)
