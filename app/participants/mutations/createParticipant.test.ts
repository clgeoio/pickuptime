import { Ctx } from "blitz"
import db from "db"
import createParticipant from "./createParticipant"

describe("createParticipant", () => {
  beforeEach(async () => {
    await db.$reset()
  })
  it("creates a participant", async () => {
    const event = await db.event.create({
      data: {
        name: "test event",
        date: new Date(),
      },
    })

    const timeslot = await db.timeslot.create({
      data: {
        eventId: event.id,
        date: new Date(),
      },
    })

    await createParticipant(
      {
        name: "testParticipant",
        eventId: event.id,
        timeslotId: timeslot.id,
        ready: false,
      },
      {} as Ctx
    )

    const e = await db.event.findFirst({ where: { id: event.id }, include: { participants: true } })

    expect(e?.participants.length).toBe(1)
    expect(e?.participants[0]?.name).toBe("testParticipant")
    expect(e?.participants[0]?.ready).toBe(false)
  })
})
