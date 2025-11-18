import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import api from 'src/@core/utils/axios'
import normalizeListResponse from 'src/@core/utils/normalizeListResponse'
import TableList from 'src/@core/components/table/TableList'

const MaterialsPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/api/materials')
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
        Learning Materials
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableList
          title='Materials'
          rows={items}
          columns={[
            { id: 'id', label: 'ID', minWidth: 80 },
            { id: 'title', label: 'Title', minWidth: 260, render: r => r.title || r.name },
            { id: 'created_at', label: 'Created', minWidth: 160 }
          ]}
          deleteEndpoint='/api/materials'
          onDeleted={row => setItems(s => s.filter(i => i.id !== row.id))}
        />
      )}
    </Box>
  )
}

export default MaterialsPage
