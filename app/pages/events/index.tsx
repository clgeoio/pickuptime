import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEvents from "app/events/queries/getEvents"
import { Button, Box, List, ListItem } from "@chakra-ui/react"

const ITEMS_PER_PAGE = 100

export const EventsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ events, hasMore }] = usePaginatedQuery(getEvents, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <Box>
      <List mb={4} ml={4}>
        {events.map((event) => (
          <ListItem key={event.id}>
            <Link href={Routes.ShowEventPage({ eventId: event.id })}>
              <a>{event.name}</a>
            </Link>
          </ListItem>
        ))}
      </List>
      <Button mr={3} disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </Button>
      <Button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </Button>
    </Box>
  )
}

const EventsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Events</title>
      </Head>

      <div>
        <Box mb={3}>
          <Link href={Routes.NewEventPage()}>
            <Button>Create Event</Button>
          </Link>
        </Box>

        <Suspense fallback={<div>Loading...</div>}>
          <EventsList />
        </Suspense>
      </div>
    </>
  )
}

EventsPage.authenticate = true
EventsPage.getLayout = (page) => <Layout>{page}</Layout>

export default EventsPage
