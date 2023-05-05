import * as React from 'react'
import { List, ListItem, ListItemButton, Box } from '@mui/material'

export type ListHelpItemsProps = {
  items: {
    id: number
    title: string
    content: string
    file: string
    selected: boolean
  }[]
  onChange: (id: number) => void
}

const ListHelpItems = ({ items, onChange }: ListHelpItemsProps) => {
  const handleChange = item => {
    onChange(item.id)
  }
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', mt: 6, p: 0 }}>
      {items.map((item, index) => (
        <ListItem key={index} disablePadding sx={{ padding: 0, margin: 0 }}>
          <ListItemButton
            role={undefined}
            dense
            sx={{
              'bgcolor': item.selected ? '#376a8a' : '#fff',
              'color': ({ palette }) => palette.getContrastText(item.selected ? '#376a8a' : '#fff'),
              '&:hover, &.Mui-focusVisible': {
                bgcolor: item.selected ? '#376a8a' : '#fff',
              },
            }}
            onClick={() => handleChange(item)}
          >
            <Box>{item.title}</Box>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default ListHelpItems
