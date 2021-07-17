import { resolver } from "blitz"
import db from "db"
import Pusher from "pusher"
import { z } from "zod"

const DeleteParticipant = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteParticipant),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const participant = await db.participant.delete({ where: { id } })

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
