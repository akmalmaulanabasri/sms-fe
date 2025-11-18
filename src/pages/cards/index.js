import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import api from 'src/@core/utils/axios'
import normalizeListResponse from 'src/@core/utils/normalizeListResponse'
import TableList from 'src/@core/components/table/TableList'

const CardsPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/api/cards')
      .then(res => {
        if (!mounted) return
        const list = normalizeListResponse(res)
        setItems(list)
      })
      .catch(() => {
        if (mounted) setItems([])
      })
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Student Cards
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableList
          title='Student Cards'
          rows={items}
          columns={[
            { id: 'id', label: 'ID', minWidth: 80 },
            { id: 'card_number', label: 'Card Number', minWidth: 180 },
            { id: 'owner', label: 'Owner', minWidth: 200 },
            { id: 'status', label: 'Status', minWidth: 120 }
          ]}
          deleteEndpoint='/api/cards'
          onDeleted={row => setItems(s => s.filter(i => i.id !== row.id))}
        />
      )}
    </Box>
  )
}

export default CardsPage
