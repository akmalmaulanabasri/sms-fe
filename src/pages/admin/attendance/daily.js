import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import api from 'src/@core/utils/axios'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const DailyAttendance = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [filters, setFilters] = useState({ classId: '', date: '', method: '' })

  useEffect(() => {
    let mounted = true
    // fetch classes for filter
    api
      .get('/api/classes')
      .then(r => mounted && setClasses(r.data || []))
      .catch(() => {})
      .finally(() => {})
    fetchData()
    return () => (mounted = false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = () => {
    setLoading(true)
    const params = {}
    if (filters.classId) params.classId = filters.classId
    if (filters.date) params.date = filters.date
    if (filters.method) params.method = filters.method
    api
      .get('/api/attendance/today', { params })
      .then(res => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Daily Attendance
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          SelectProps={{ native: true }}
          label='Kelas'
          value={filters.classId}
          onChange={e => setFilters({ ...filters, classId: e.target.value })}
        >
          <option value=''>Semua</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>
              {c.name || c.class_name}
            </option>
          ))}
        </TextField>
        <TextField
          type='date'
          label='Tanggal'
          InputLabelProps={{ shrink: true }}
          value={filters.date}
          onChange={e => setFilters({ ...filters, date: e.target.value })}
        />
        <TextField
          select
          SelectProps={{ native: true }}
          label='Metode'
          value={filters.method}
          onChange={e => setFilters({ ...filters, method: e.target.value })}
        >
          <option value=''>Semua</option>
          <option value='manual'>Manual</option>
          <option value='rfid'>RFID</option>
          <option value='finger'>Fingerprint</option>
        </TextField>
        <Button variant='contained' onClick={fetchData} sx={{ alignSelf: 'center' }}>
          Filter
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {items.map(a => (
            <ListItem key={a.id}>{a.name || a.student_name || JSON.stringify(a)}</ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default DailyAttendance
