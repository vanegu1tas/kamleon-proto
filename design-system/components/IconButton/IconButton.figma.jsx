import figma from '@figma/code-connect'
import IconButton from './IconButton.jsx'

figma.connect(IconButton, 'https://www.figma.com/design/ozgwasF3ziQyznQS0z0dM1/Design-system?node-id=2201-670', {
  props: {
    variant: figma.enum('Mode', {
      Default: 'default',
      Danger: 'danger',
    }),
    disabled: figma.enum('State', {
      Disabled: true,
    }),
  },
  example: ({ variant, disabled }) => (
    <IconButton variant={variant} disabled={disabled} aria-label="action">
      {/* icon */}
    </IconButton>
  ),
})
