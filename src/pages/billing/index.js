import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import api from 'src/@core/utils/axios'
import normalizeListResponse from 'src/@core/utils/normalizeListResponse'
import TableList from 'src/@core/components/table/TableList'

const BillingPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/api/billing')
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
        Billing & Payments
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableList
          title='Billing & Payments'
          rows={items}
          columns={[
            { id: 'id', label: 'ID', minWidth: 80 },
            { id: 'invoice', label: 'Invoice', minWidth: 180 },
            { id: 'amount', label: 'Amount', minWidth: 120 },
            { id: 'status', label: 'Status', minWidth: 120 },
            { id: 'created_at', label: 'Created', minWidth: 160 }
          ]}
          deleteEndpoint='/api/billing'
          onDeleted={row => setItems(s => s.filter(i => i.id !== row.id))}
        />
      )}
    </Box>
  )
}

export default BillingPage
