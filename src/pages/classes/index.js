import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import api from 'src/@core/utils/axios'
import normalizeListResponse from 'src/@core/utils/normalizeListResponse'
import TableList from 'src/@core/components/table/TableList'

const ClassesPage = () => {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/api/classes')
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
        Classes
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableList
          title='Classes'
          addLink='/classes/add'
          rows={items}
          columns={[
            { id: 'id', label: 'ID', minWidth: 80 },
            { id: 'name', label: 'Name', minWidth: 200, render: r => r.name || r.class_name },
            { id: 'grade', label: 'Grade', minWidth: 120, render: r => r.grade || r.level || r.class_grade || '' },
            {
              id: 'teacher',
              label: 'Teacher',
              minWidth: 200,
              render: r => (r.homeroomTeacher && r.homeroomTeacher.name) || r.teacher_name || r.teacher || ''
            }
          ]}
          onEdit={row => router.push(`/classes/${row.id}/edit`)}
          deleteEndpoint='/api/classes'
          onDeleted={row => setItems(s => s.filter(i => i.id !== row.id))}
        />
      )}
    </Box>
  )
}

export default ClassesPage
