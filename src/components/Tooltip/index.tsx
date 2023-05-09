import * as React from 'react'
import { styled } from '@mui/material/styles'
import MUITooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MUITooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
  zIndex: theme.zIndex.tooltip - 1,
}))

export default Tooltip
