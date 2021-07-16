import { Box, BoxProps, Select, SelectProps } from "@chakra-ui/react"
import { forwardRef } from "react"
import { useField } from "react-final-form"

export interface LabeledSelectFieldProps extends SelectProps {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: BoxProps
  options: string[]
}

export const LabeledSelectField = forwardRef<HTMLSelectElement, LabeledSelectFieldProps>(
  ({ name, label, outerProps, options, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, { initialValue: options[0] })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <Box {...outerProps}>
        <label>
          {label}
          <Select {...input} disabled={submitting} {...props} ref={ref}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
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

export default LabeledSelectField
