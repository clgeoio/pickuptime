import { ReactNode } from "react"
import { Head } from "blitz"
import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react"
import { Suspense } from "react"
import { Link, useMutation, Routes } from "blitz"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"

type LayoutProps = {
  title?: string
  children: ReactNode
}

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
        {/* <Link href={Routes.SignupPage()}>
          <Button>Sign Up</Button>
        </Link> */}
        <Link href={Routes.LoginPage()}>
          <Button ml={3}>Login</Button>
        </Link>
      </>
    )
  }
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "pickuptime"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
            {children}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Layout
