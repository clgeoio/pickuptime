import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createEvent from "app/events/mutations/createEvent"
import { EventForm, FORM_ERROR } from "app/events/components/EventForm"
import { isBefore, addMinutes, isEqual, startOfDay } from "date-fns"
import { Heading, Box, Flex } from "@chakra-ui/react"

const generateTimeSlots = ({
  start,
  end,
  interval,
}: {
  start: number
  end: number
  interval: number
}): Date[] => {
  const from = new Date(start)
  const to = new Date(end)
  const step = (x: Date): Date => addMinutes(x, interval)
  const blocks: Date[] = []

  let cursor = from

  while (isBefore(cursor, to) || isEqual(cursor, to)) {
    blocks.push(cursor)
    cursor = step(cursor)
  }

  return blocks
}

const NewEventPage: BlitzPage = () => {
  const router = useRouter()
  const [createEventMutation] = useMutation(createEvent)

  return (
    <div>
      <Heading size="lg">Create New Event</Heading>

      <Flex width="full" alignItems="center" justifyContent="center">
        <Box bg="white" boxShadow="sm" p={6} borderRadius="md" maxW="lg" w="full">
          <EventForm
            submitText="Create Event"
            // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            // schema={CreateEvent}
            // initialValues={{}}
            onSubmit={async (values) => {
              try {
                const date = startOfDay(values.date)
                const interval = parseInt(values.slotTime)
                const start = new Date(date).setHours(17, 0, 0, 0)
                const end = new Date(start).setHours(19, 0, 0, 0)

                const timeslots = generateTimeSlots({ start, end, interval }).map((slot) => ({
                  date: slot,
                }))

                const event = await createEventMutation({ date, ...values, timeslots })
                await router.push(Routes.ShowEventPage({ eventId: event.id }))
              } catch (error) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Box>
      </Flex>
      <p>
        <Link href={Routes.EventsPage()}>
          <a>Events</a>
        </Link>
      </p>
    </div>
  )
}

NewEventPage.authenticate = true
NewEventPage.getLayout = (page) => <Layout title={"Create New Event"}>{page}</Layout>

export default NewEventPage
