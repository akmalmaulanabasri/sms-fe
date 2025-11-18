import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useState, useEffect } from 'react'
import api from 'src/@core/utils/axios'
import { useRouter } from 'next/router'

const AddStudent = () => {
  const [form, setForm] = useState({ name: '', nis: '', classId: '' })
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    api.get('/api/classes').then(r => mounted && setClasses(r.data || [])).catch(() => {}).finally(() => (mounted = false))
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/students', form)
      router.push('/students')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 6, maxWidth: 640 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Tambah Siswa
      </Typography>
      <form onSubmit={submit}>
        <TextField fullWidth label='Nama' name='name' value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label='NIS' name='nis' value={form.nis} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField
          select
          SelectProps={{ native: true }}
          fullWidth
          label='Kelas'
          name='classId'
          value={form.classId}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <option value=''>Pilih kelas</option>
          {classes.map(c => (
            <option value={c.id} key={c.id}>
              {c.name || c.class_name}
            </option>
          ))}
        </TextField>
        <Button type='submit' variant='contained' disabled={loading}>
          {loading ? 'Menyimpan…' : 'Simpan'}
        </Button>
      </form>
    </Box>
  )
}

export default AddStudent
