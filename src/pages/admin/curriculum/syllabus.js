import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import CircularProgress from '@mui/material/CircularProgress'
import api from 'src/@core/utils/axios'

const SyllabusPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get('/api/syllabi')
      .then(res => mounted && setItems(res.data || []))
      .catch(() => mounted && setItems([]))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Silabus & RPP
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {items.map(s => (
            <ListItem key={s.id}>{s.title || s.subject || JSON.stringify(s)}</ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default SyllabusPage
