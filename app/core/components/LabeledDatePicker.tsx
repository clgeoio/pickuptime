import { forwardRef } from "react"
import { useField } from "react-final-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { Flex, BoxProps, InputProps, Input } from "@chakra-ui/react"

export interface LabeledDatePickerProps extends InputProps {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  outerProps?: BoxProps
  validate?: (value: any) => string | undefined
}

export const LabeledDatePicker = forwardRef<HTMLInputElement, LabeledDatePickerProps>(
  ({ name, label, outerProps, validate, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError },
    } = useField(name, { validate })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <Flex {...outerProps} w="full">
        <DatePicker
          {...props}
          ref={ref}
          selected={input.value}
          name={name}
          onChange={(date) => {
            input.onChange(new Date(date))
          }}
          customInput={<Input w="full" />}
        />

        {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}
      </Flex>
    )
  }
)

export default LabeledDatePicker
