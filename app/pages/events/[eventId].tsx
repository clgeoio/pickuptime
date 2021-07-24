import React, { Suspense, useEffect, useMemo, useState } from "react"
import {
  Head,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  Routes,
  invokeWithMiddleware,
  QueryClient,
  getQueryKey,
  dehydrate,
  Ctx,
  GetServerSideProps,
} from "blitz"
import Pusher from "pusher-js"
import Layout from "app/core/layouts/Layout"
import getEvent from "app/events/queries/getEvent"
import deleteEvent from "app/events/mutations/deleteEvent"
import { Card } from "app/events/components/Card"
import createParticipant from "app/participants/mutations/createParticipant"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import deleteParticipant from "app/participants/mutations/deleteParticipant"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
} from "@chakra-ui/react"
import { useLocalStorage } from "app/core/hooks/useLocalStorage"
import { format } from "date-fns"

export const Event = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const eventId = useParam("eventId", "string")
  const [deleteEventMutation] = useMutation(deleteEvent)
  const [createParticipantMutation] = useMutation(createParticipant)
  const [deleteParticipantMutation] = useMutation(deleteParticipant)
  const [participantId, setParticipantId] = useLocalStorage(`participantId-${eventId}`)
  const [organizerView, setOrganizerView] = useLocalStorage("organizerView", false)
  const [showAdded, setShowAdded] = useState(false)
  const [event, { refetch: refetchEvent }] = useQuery(getEvent, {
    id: eventId,
  })
  const { id, name, timeslots, date } = event

  useEffect(() => {
    const pusher = new Pusher("95fbbd446a25b7ad3518", {
      cluster: "ap4",
    })

    const channel = pusher.subscribe(`public-${eventId}`)
    channel.bind("participantChange", () => {
      refetchEvent()
    })
  }, [eventId, refetchEvent])

  const filteredSlots = useMemo(() => {
    if (participantId && !organizerView) {
      return timeslots.filter((slot) => slot.participants.map((p) => p.id).includes(participantId))
    }
    return timeslots
  }, [timeslots, participantId, organizerView])

  const handleAddParticipant = async (timeslotId: number, name: string) => {
    if (id) {
      const participant = await createParticipantMutation({
        timeslotId,
        eventId: id,
        name,
        ready: false,
      })
      setParticipantId(participant.id)
      setShowAdded(true)
    }
  }

  const handleRemoveParticipant = async (participantId: number) => {
    await deleteParticipantMutation({ id: participantId })
    setParticipantId(undefined)
    setShowAdded(false)
    await refetchEvent()
  }

  return (
    <>
      <Head>
        <title>
          {name} - {format(date, "dd/MM/yy")}
        </title>
      </Head>
      <Flex direction="column">
        {showAdded && (
          <Alert status="success" mb={5}>
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription display="block">
                You have been added to the timeslot
              </AlertDescription>
            </Box>
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => setShowAdded(false)}
            />
          </Alert>
        )}

        <Card
          title={name}
          date={date}
          timeslots={filteredSlots}
          addParticipant={handleAddParticipant}
          removeParticipant={handleRemoveParticipant}
          participantId={participantId}
          organizerView={organizerView}
          toggleOrganizerView={() => setOrganizerView(!organizerView)}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient()
  const params = { id: ctx.params?.eventId as string }
  const queryKey = getQueryKey(getEvent, params)

  await queryClient.prefetchQuery(queryKey, () => invokeWithMiddleware(getEvent, params, ctx))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

ShowEventPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowEventPage
