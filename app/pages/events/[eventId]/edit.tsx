import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEvent from "app/events/queries/getEvent"
import updateEvent from "app/events/mutations/updateEvent"
import { EventForm, FORM_ERROR } from "app/events/components/EventForm"

export const EditEvent = () => {
  const router = useRouter()
  const eventId = useParam("eventId", "number")
  const [event, { setQueryData }] = useQuery(
    getEvent,
    { id: eventId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateEventMutation] = useMutation(updateEvent)

  return (
    <>
      <Head>
        <title>Edit Event {event.id}</title>
      </Head>

      <div>
        <h1>Edit Event {event.id}</h1>
        <pre>{JSON.stringify(event)}</pre>

        <EventForm
          submitText="Update Event"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateEvent}
          initialValues={event}
          onSubmit={async (values) => {
            try {
              const updated = await updateEventMutation({
                id: event.id,
                ...values,
              })
              await setQueryData({ ...updated, timeslots: event.timeslots })
              router.push(Routes.ShowEventPage({ eventId: updated.id }))
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditEventPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditEvent />
      </Suspense>

      <p>
        <Link href={Routes.EventsPage()}>
          <a>Events</a>
        </Link>
      </p>
    </div>
  )
}

EditEventPage.authenticate = true
EditEventPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditEventPage
