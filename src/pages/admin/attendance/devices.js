import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import api from 'src/@core/utils/axios'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

const DevicesPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get('/api/attendance/devices')
      .then(res => mounted && setItems(res.data || []))
      .catch(() => mounted && setItems([]))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Attendance Devices
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {items.map(d => (
            <ListItem key={d.id}>{d.name || d.serial || JSON.stringify(d)}</ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default DevicesPage
