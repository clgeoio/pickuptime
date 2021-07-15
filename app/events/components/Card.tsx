import {
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Box,
  Icon,
  Tag,
  TagLabel,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import { useLocalStorage } from "app/core/hooks/useLocalStorage"
import { format } from "date-fns"
import { Participant, Timeslot } from "db"
import React, { ChangeEventHandler, FunctionComponent, useState } from "react"
import { BiTimeFive, BiCheck, BiPlus, BiX } from "react-icons/bi"
import { BsPeopleFill } from "react-icons/bs"

interface CardProps {
  date: Date
  title: string
  timeslots: (Timeslot & {
    participants: Participant[]
  })[]
  addParticipant: (timeslotId: number, name: string) => Promise<number | undefined>
  removeParticipant: (participantId: number) => void
}

interface TagsProps {
  participants: Participant[]
}
const Tags: FunctionComponent<TagsProps> = ({ participants }) => {
  return (
    <Flex>
      <Tag size="sm" variant="subtle" colorScheme="cyan" mr={2}>
        <Text as="span" fontWeight="bold" mr={1}>
          {participants.length}
        </Text>
        <Icon as={BsPeopleFill} h={4} w={4} />
      </Tag>
      <Tag size="sm" variant="subtle" colorScheme="green">
        <Text as="span" fontWeight="bold" mr={1}>
          {participants.filter((p) => p.ready).length}
        </Text>
        <Icon as={BiCheck} h={4} w={4} />
      </Tag>
    </Flex>
  )
}

const Card: FunctionComponent<CardProps> = ({
  date,
  title,
  timeslots,
  addParticipant,
  removeParticipant,
}) => {
  const [participantId, setParticipantId] = useLocalStorage("participantId")
  const [timeslotId, setTimeslotId] = useState<number | undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const timeColor = useColorModeValue("gray.600", "gray.400")
  const handleOpen = (timeslotId: number) => {
    setTimeslotId(timeslotId)
    onOpen()
  }

  const handleAddParticipant = async (name: string) => {
    if (timeslotId !== undefined) {
      const id = await addParticipant(timeslotId, name)
      setTimeslotId(undefined)
      setParticipantId(id)
    }
  }

  const handleRemoveParticipant = (participantId: number) => {
    removeParticipant(participantId)
    setParticipantId(undefined)
  }

  return (
    <Flex
      bg={useColorModeValue("#F9FAFB", "gray.600")}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={{ base: 2, md: 4 }}
        rounded="lg"
        shadow="lg"
        bg={useColorModeValue("white", "gray.800")}
        w="full"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg" color={useColorModeValue("gray.700", "white")} mr={6}>
            {title}
          </Heading>
          <Text fontSize="lg" color={timeColor}>
            {format(date, "eee do")}
          </Text>
        </Flex>

        <Box mt={2}>
          <Text color={timeColor} mb={3}>
            Timeslots
          </Text>
          {timeslots.map((slot) => (
            <Flex key={slot.id} width="full" mb={8} flexDirection="column">
              <Flex alignItems="center" justifyContent="space-between" width="full">
                <Flex alignItems="center">
                  <Icon as={BiTimeFive} h={4} w={4} mr={2} />
                  <Text color={timeColor}>{format(slot.date, "KK:mm aa")}</Text>
                </Flex>
                <Tags participants={slot.participants} />
              </Flex>
              <Box mt={2} ml={6} flexDirection="row">
                {slot.participants.map((participant) => (
                  <Flex mt={2} mb={2} key={participant.id} justifyContent="space-between">
                    <Text>{participant.name}</Text>
                    {participantId === participant.id && (
                      <Icon
                        as={BiX}
                        h={6}
                        w={6}
                        fill="red.700"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => handleRemoveParticipant(participant.id)}
                      />
                    )}
                  </Flex>
                ))}
                {participantId === undefined && (
                  <Button w="full" size="sm" onClick={() => handleOpen(slot.id)}>
                    <Icon as={BiPlus} h={4} w={4} />
                    Join {format(slot.date, "KK:mm aa")}
                  </Button>
                )}
              </Box>
            </Flex>
          ))}
        </Box>
      </Box>
      <NameModal isOpen={isOpen} onClose={onClose} handleNameAdd={handleAddParticipant} />
    </Flex>
  )
}

const NameModal: FunctionComponent<{
  isOpen: boolean
  onClose: () => void
  handleNameAdd: (name: string) => void
}> = ({ onClose, isOpen, handleNameAdd }) => {
  const [value, setValue] = useState("")
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => setValue(event.target.value)

  const handleAdd = () => {
    handleNameAdd(value)
    setValue("")
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Name:</Text>
            <Input value={value} onChange={handleChange} placeholder="Jane S." size="sm" />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost">Cancel</Button>
            <Button colorScheme="blue" mr={3} onClick={handleAdd}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { Card }
export type { CardProps }