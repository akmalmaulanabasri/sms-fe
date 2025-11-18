import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useState, useEffect } from 'react'
import api from 'src/@core/utils/axios'
import { useRouter } from 'next/router'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Chip from '@mui/material/Chip'

const AddTeacher = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    nip: '',
    subjects: [],
    phone: '',
    gender: '',
    address: '',
    status: ''
  })
  const [loading, setLoading] = useState(false)
  const [subjectsOptions, setSubjectsOptions] = useState([])
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    api.get('/api/subjects').then(res => {
      if (!mounted) return
      const data = res && res.data ? res.data : res
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : Array.isArray(data.data)
        ? data.data
        : []
      setSubjectsOptions(list)
    })
    return () => (mounted = false)
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      // send subjects as array of ids
      const payload = { ...form }
      if (Array.isArray(payload.subjects)) payload.subjects = payload.subjects.map(s => Number(s))
      await api.post('/api/teachers', payload)
      router.push('/teachers')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, m: 3 }}>
      <CardHeader title={<Typography variant='h5'>Tambah Guru</Typography>} />
      <CardContent>
        <form onSubmit={submit}>
          <TextField fullWidth label='Nama' name='name' value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label='Email' name='email' value={form.email} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label='NIP' name='nip' value={form.nip} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label='Phone' name='phone' value={form.phone} onChange={handleChange} sx={{ mb: 2 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id='gender-label'>Gender</InputLabel>
            <Select labelId='gender-label' label='Gender' name='gender' value={form.gender} onChange={handleChange}>
              <MenuItem value={'M'}>Male</MenuItem>
              <MenuItem value={'F'}>Female</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label='Address'
            name='address'
            value={form.address}
            onChange={handleChange}
            sx={{ mb: 2 }}
            multiline
            rows={3}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id='status-label'>Status</InputLabel>
            <Select labelId='status-label' label='Status' name='status' value={form.status} onChange={handleChange}>
              <MenuItem value={'active'}>Active</MenuItem>
              <MenuItem value={'inactive'}>Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id='subjects-label'>Mata Pelajaran</InputLabel>
            <Select
              labelId='subjects-label'
              label='Mata Pelajaran'
              multiple
              name='subjects'
              value={form.subjects}
              onChange={e => setForm({ ...form, subjects: e.target.value })}
              renderValue={selected => (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {selected.map(id => {
                    const s = subjectsOptions.find(x => x.id === id || x.id === Number(id))
                    return <Chip key={id} label={s ? s.name : id} />
                  })}
                </Box>
              )}
            >
              {subjectsOptions.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
        <Button type='submit' variant='contained' disabled={loading} onClick={submit}>
          {loading ? 'Menyimpan…' : 'Simpan'}
        </Button>
      </CardActions>
    </Card>
  )
}

export default AddTeacher
