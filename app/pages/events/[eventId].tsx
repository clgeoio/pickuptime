import React, { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEvent from "app/events/queries/getEvent"
import deleteEvent from "app/events/mutations/deleteEvent"
import { Card } from "app/events/components/Card"
import createParticipant from "app/participants/mutations/createParticipant"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import deleteParticipant from "app/participants/mutations/deleteParticipant"

export const Event = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const eventId = useParam("eventId", "string")
  const [deleteEventMutation] = useMutation(deleteEvent)
  const [createParticipantMutation] = useMutation(createParticipant)
  const [deleteParticipantMutation] = useMutation(deleteParticipant)
  const [{ id, date, name, timeslots }, { refetch: refetchEvent }] = useQuery(getEvent, {
    id: eventId,
  })

  const handleAddParticipant = async (timeslotId: number, name: string) => {
    if (id) {
      const participant = await createParticipantMutation({
        timeslotId,
        eventId: id,
        name,
        ready: false,
      })
      await refetchEvent()
      return participant.id
    }
  }

  const handleRemoveParticipant = async (participantId: number) => {
    await deleteParticipantMutation({ id: participantId })
    await refetchEvent()
  }

  return (
    <>
      <Head>
        <title>Event {id}</title>
      </Head>
      <div>
        <Card
          title={name}
          date={date}
          timeslots={timeslots}
          addParticipant={handleAddParticipant}
          removeParticipant={handleRemoveParticipant}
        />

        <Link href={Routes.EditEventPage({ eventId: id })}>
          <a>Edit</a>
        </Link>
        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteEventMutation({ id: id })
              router.push(Routes.EventsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowEventPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Event />
    </Suspense>
  )
}

ShowEventPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowEventPage
