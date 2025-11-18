import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import api from 'src/@core/utils/axios'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

const TeacherAttendance = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get('/api/teacher/attendance')
      .then(res => mounted && setItems(res.data || []))
      .catch(() => mounted && setItems([]))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Class Attendance
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {items.map(i => (
            <ListItem key={i.id}>{i.name || JSON.stringify(i)}</ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default TeacherAttendance
