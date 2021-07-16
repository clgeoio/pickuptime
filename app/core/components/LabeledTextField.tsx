import { Box, BoxProps, Input, InputProps } from "@chakra-ui/react"
import React, { forwardRef, PropsWithoutRef } from "react"
import { useField, FieldProps } from "react-final-form"

export interface LabeledTextFieldProps extends InputProps {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: BoxProps
  validate?: (value: any) => string | undefined
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, validate, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse: props.type === "number" ? Number : undefined,
      validate,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <Box {...outerProps}>
        <label>
          {label}
          <Input {...input} disabled={submitting} {...props} ref={ref} w="full" />
        </label>

        {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}
      </Box>
    )
  }
)

export default LabeledTextField
