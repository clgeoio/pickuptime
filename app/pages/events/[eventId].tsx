import React, { Suspense, useMemo } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEvent from "app/events/queries/getEvent"
import deleteEvent from "app/events/mutations/deleteEvent"
import { Card } from "app/events/components/Card"
import createParticipant from "app/participants/mutations/createParticipant"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import deleteParticipant from "app/participants/mutations/deleteParticipant"
import { Button, Flex } from "@chakra-ui/react"
import { useState } from "react"
import { useLocalStorage } from "app/core/hooks/useLocalStorage"

export const Event = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const eventId = useParam("eventId", "string")
  const [deleteEventMutation] = useMutation(deleteEvent)
  const [createParticipantMutation] = useMutation(createParticipant)
  const [deleteParticipantMutation] = useMutation(deleteParticipant)
  const [participantId, setParticipantId] = useLocalStorage("participantId")
  const [{ id, date, name, timeslots }, { refetch: refetchEvent }] = useQuery(getEvent, {
    id: eventId,
  })

  const filteredSlots = useMemo(() => {
    if (participantId) {
      return timeslots.filter((slot) => slot.participants.map((p) => p.id).includes(participantId))
    }
    return timeslots
  }, [timeslots, participantId])

  const handleAddParticipant = async (timeslotId: number, name: string) => {
    if (id) {
      const participant = await createParticipantMutation({
        timeslotId,
        eventId: id,
        name,
        ready: false,
      })
      await refetchEvent()
      setParticipantId(participant.id)
    }
  }

  const handleRemoveParticipant = async (participantId: number) => {
    await deleteParticipantMutation({ id: participantId })
    setParticipantId(undefined)
    await refetchEvent()
  }

  return (
    <>
      <Head>
        <title>Event {id}</title>
      </Head>
      <Flex>
        <Card
          title={name}
          date={date}
          timeslots={filteredSlots}
          addParticipant={handleAddParticipant}
          removeParticipant={handleRemoveParticipant}
          participantId={participantId}
        />
      </Flex>
      {user && (
        <Button
          mt={3}
          colorScheme="red"
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
        </Button>
      )}
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
