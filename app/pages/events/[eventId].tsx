import React, { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEvent from "app/events/queries/getEvent"
import deleteEvent from "app/events/mutations/deleteEvent"
import { Card } from "app/events/components/Card"
import createParticipant from "app/participants/mutations/createParticipant"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import deleteParticipant from "app/participants/mutations/deleteParticipant"
import updateEvent from "app/events/mutations/updateEvent"

export const Event = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const eventId = useParam("eventId", "number")
  const [deleteEventMutation] = useMutation(deleteEvent)
  const [updateTimeslotMutation] = useMutation(updateTimeslot)
  const [createParticipantMutation] = useMutation(createParticipant)
  const [deleteParticipantMutation] = useMutation(deleteParticipant)
  const [{ id, date, name, timeslots }, { refetch: refetchEvent }] = useQuery(getEvent, {
    id: eventId,
  })

  const handleAddParticipant = async (timeslotId: number) => {
    if (user?.name) {
      await createParticipantMutation({ timeslotId, name: user.name, ready: false })
      await refetchEvent()
    }
  }

  const handleRemoveParticipant = async (participantId: number) => {
    if (user?.name) {
      await updateEventMutation({ id, date, name, timeslots })
      await deleteParticipantMutation({ id: participantId })
      await refetchEvent()
    }
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

ShowEventPage.authenticate = true
ShowEventPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowEventPage
