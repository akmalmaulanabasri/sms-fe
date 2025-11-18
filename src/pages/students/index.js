import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import api from 'src/@core/utils/axios'
import normalizeListResponse from 'src/@core/utils/normalizeListResponse'
import Button from '@mui/material/Button'
import Link from 'next/link'
import TableList from 'src/@core/components/table/TableList'

const StudentsPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/api/students')
      .then(res => {
        if (!mounted) return
        const list = normalizeListResponse(res)
        setStudents(list)
      })
      .catch(() => {
        if (mounted) setStudents([])
      })
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4'>Students</Typography>
        <Link href='/students/add' passHref>
          <Button variant='contained'>Tambah Siswa</Button>
        </Link>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableList
          title='Students'
          rows={students}
          columns={[
            { id: 'id', label: 'ID', minWidth: 80 },
            {
              id: 'name',
              label: 'Name',
              minWidth: 200,
              render: r => r.name || `${r.firstName || ''} ${r.lastName || ''}`.trim()
            },
            { id: 'email', label: 'Email', minWidth: 220 },
            { id: 'phone', label: 'Phone', minWidth: 140 },
            { id: 'status', label: 'Status', minWidth: 100 }
          ]}
          addLink='/students/add'
          deleteEndpoint='/api/students'
          onDeleted={row => setStudents(s => s.filter(i => i.id !== row.id))}
        />
      )}
    </Box>
  )
}

export default StudentsPage
