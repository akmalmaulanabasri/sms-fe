import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import CircularProgress from '@mui/material/CircularProgress'
import api from 'src/@core/utils/axios'

const ReportsPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get('/api/reports')
      .then(res => mounted && setItems(res.data || []))
      .catch(() => mounted && setItems([]))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Reports & Grades
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {items.map(r => (
            <ListItem key={r.id}>{r.title || r.name || JSON.stringify(r)}</ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default ReportsPage
