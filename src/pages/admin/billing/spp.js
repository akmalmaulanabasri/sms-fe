import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import api from 'src/@core/utils/axios'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

const SppPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get('/api/spp')
      .then(res => mounted && setItems(res.data || []))
      .catch(() => mounted && setItems([]))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Billing SPP
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {items.map(s => (
            <ListItem key={s.id}>{s.invoice || s.student || JSON.stringify(s)}</ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default SppPage
