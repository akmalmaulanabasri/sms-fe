import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import api from 'src/@core/utils/axios'
import normalizeListResponse from 'src/@core/utils/normalizeListResponse'
import TableList from 'src/@core/components/table/TableList'
import { useRouter } from 'next/router'

const SubjectsPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/api/subjects')
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

  const router = useRouter()

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Subjects
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableList
          title='Subjects'
          addLink='/subjects/add'
          rows={items}
          columns={[
            { id: 'id', label: 'ID', minWidth: 80 },
            { id: 'name', label: 'Subject', minWidth: 220, render: r => r.name || r.title || r.subject_name },
            { id: 'grade', label: 'Grade', minWidth: 120, render: r => r.grade || r.level || '' },
            {
              id: 'teachers',
              label: 'Teachers',
              minWidth: 220,
              render: r => (Array.isArray(r.teachers) ? r.teachers.map(t => t.name).join(', ') : '')
            },
            { id: 'created_at', label: 'Created', minWidth: 160 }
          ]}
          onEdit={row => router.push(`/subjects/${row.id}/edit`)}
          deleteEndpoint='/api/subjects'
          onDeleted={row => setItems(s => s.filter(i => i.id !== row.id))}
        />
      )}
    </Box>
  )
}

export default SubjectsPage
