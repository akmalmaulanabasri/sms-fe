import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import CircularProgress from '@mui/material/CircularProgress'
import api from 'src/@core/utils/axios'

const CurriculumPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get('/api/curricula')
      .then(res => mounted && setItems(res.data || []))
      .catch(() => mounted && setItems([]))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Curriculum Management
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {items.map(i => (
            <ListItem key={i.id}>{i.name || i.level || JSON.stringify(i)}</ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default CurriculumPage
