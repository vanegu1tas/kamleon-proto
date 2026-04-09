import figma from '@figma/code-connect'
import Button from './Button.jsx'

figma.connect(Button, 'https://www.figma.com/design/ozgwasF3ziQyznQS0z0dM1/Design-system?node-id=2149-695', {
  props: {
    variant: figma.enum('Type', {
      Primary: 'primary',
      Secondary: 'secondary',
    }),
    size: figma.enum('Size', {
      S: 's',
      M: 'm',
    }),
    disabled: figma.enum('State', {
      Disabled: true,
    }),
  },
  example: ({ variant, size, disabled }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      Label
    </Button>
  ),
})
