import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { Box, Button, Flex, IconButton, useColorModeValue, useDisclosure } from "@chakra-ui/react"

import { FiMenu } from "react-icons/fi"

import React from "react"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <div>
          <code>{currentUser.id}</code> <code>{currentUser.role}</code>
        </div>
        <Button
          ml={2}
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </Button>
      </>
    )
  } else {
    return (
      <>
        <Link href={Routes.SignupPage()}>
          <Button>Sign Up</Button>
        </Link>
        <Link href={Routes.LoginPage()}>
          <Button ml={3}>Login</Button>
        </Link>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <Box as="section" bg={useColorModeValue("gray.50", "gray.700")} minH="100vh">
      <Box ml={{ base: 0 }} transition=".3s ease">
        <Flex
          as="header"
          align="center"
          justify="flex-end"
          w="full"
          px="4"
          bg={useColorModeValue("white", "gray.800")}
          borderBottomWidth="1px"
          borderColor="blackAlpha.300"
          h="14"
        >
          <Flex align="center">
            <Suspense fallback="Loading...">
              <UserInfo />
            </Suspense>
          </Flex>
        </Flex>

        <Box as="main" p="4">
          {/* Add content here, remove div below  */}
          <Box borderWidth="4px" borderStyle="dashed" rounded="md" h="96" />
        </Box>
      </Box>
    </Box>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
