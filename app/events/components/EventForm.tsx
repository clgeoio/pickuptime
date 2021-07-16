import { FormControl, VStack } from "@chakra-ui/react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledDatePicker } from "app/core/components/LabeledDatePicker"
import { LabeledSelectField } from "app/core/components/LabeledSelectField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function EventForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField
        name="name"
        label="Name"
        placeholder="Name"
        validate={(value) => (Boolean(value) ? undefined : "Required")}
      />
      <LabeledSelectField name="slotTime" label="Slot Times (minutes)" options={["15", "30"]} />
      <LabeledDatePicker name="date" label="Date" />
    </Form>
  )
}
