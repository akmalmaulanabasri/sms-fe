import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import TableList from 'src/@core/components/table/TableList'
import Icon from 'src/@core/components/icon'
import api from 'src/@core/utils/axios'
import normalizeListResponse from 'src/@core/utils/normalizeListResponse'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/api/teachers')
      .then(res => {
        if (!mounted) return
        const list = normalizeListResponse(res)
        setTeachers(list)
      })
      .catch(() => {
        if (mounted) setTeachers([])
      })
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  // Table columns
  const columns = [
    { id: 'nip', label: 'NIP', minWidth: 120 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'phone', label: 'Phone', minWidth: 140 },
    { id: 'gender', label: 'Gender', minWidth: 80 },
    { id: 'address', label: 'Address', minWidth: 240 },
    {
      id: 'subjects',
      label: 'Subjects',
      minWidth: 200,
      render: r => {
        const subs = Array.isArray(r.subjects) ? r.subjects : Array.isArray(r.Subjects) ? r.Subjects : []
        return subs.map(s => s.name).join(', ')
      }
    },
    { id: 'status', label: 'Status', minWidth: 100 }
  ]

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Box sx={{ p: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4'>Teachers</Typography>
        <Link href='/teachers/add' passHref>
          <Button variant='contained'>Tambah Guru</Button>
        </Link>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableList
          title='Teachers'
          rows={teachers}
          columns={columns}
          addLink='/teachers/add'
          deleteEndpoint='/api/teachers'
          onDeleted={row => setTeachers(s => s.filter(i => i.id !== row.id))}
          onEdit={row => router.push(`/teachers/${row.id}/edit`)}
        />
      )}
    </Box>
  )
}

export default TeachersPage
