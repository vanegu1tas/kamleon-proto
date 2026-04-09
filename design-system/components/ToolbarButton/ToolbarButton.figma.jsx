import figma from '@figma/code-connect'
import ToolbarButton from './ToolbarButton.jsx'

figma.connect(ToolbarButton, 'https://www.figma.com/design/ozgwasF3ziQyznQS0z0dM1/Design-system?node-id=2191-1326', {
  props: {
    selected: figma.enum('State', {
      Selected: true,
    }),
    disabled: figma.enum('State', {
      Variant4: true,
    }),
  },
  example: ({ selected, disabled }) => (
    <ToolbarButton selected={selected} disabled={disabled}>
      Filters
    </ToolbarButton>
  ),
})
