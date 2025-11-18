import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import api from 'src/@core/utils/axios'

const AttendancePage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const fetch = () => {
    setLoading(true)
    api
      .get('/api/attendance')
      .then(res => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetch()
  }, [])

  const createAttendance = () => {
    setCreating(true)
    api
      .post('/api/attendance', { note: 'Quick attendance from FE' })
      .then(() => fetch())
      .catch(() => {})
      .finally(() => setCreating(false))
  }

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Attendance
      </Typography>
      <Button variant='contained' onClick={createAttendance} disabled={creating} sx={{ mb: 2 }}>
        {creating ? 'Creating…' : 'Create Attendance'}
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {items.map(a => (
            <ListItem key={a.id}>{a.note || a.description || JSON.stringify(a)}</ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default AttendancePage
