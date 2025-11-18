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
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const EditStudent = () => {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({ name: '', nis: '', classId: '' })
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    let mounted = true
    Promise.all([api.get(`/api/students/${id}`), api.get('/api/classes')])
      .then(([sRes, cRes]) => {
        if (!mounted) return
        const sPayload = sRes && sRes.data ? sRes.data : sRes
        const student = sPayload && sPayload.results ? sPayload.results : {}
        const cPayload = cRes && cRes.data ? cRes.data.results || cRes.data : cRes
        setClasses(Array.isArray(cPayload) ? cPayload : [])
        setForm({
          name: student.name || '',
          nis: student.nis || '',
          classId: student.class_id || ''
        })
      })
      .catch(err => console.error(err))
      .finally(() => (mounted = false))
    return () => (mounted = false)
  }, [id])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form }
      // adjust field names if needed by backend
      if (payload.classId) payload.class_id = payload.classId
      delete payload.classId
      await api.put(`/api/students/${id}`, payload)
      router.push('/students')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, m: 3 }}>
      <CardHeader title={<Typography variant='h5'>Edit Student</Typography>} />
      <CardContent>
        <form onSubmit={submit}>
          <TextField fullWidth label='Nama' name='name' value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label='NIS' name='nis' value={form.nis} onChange={handleChange} sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id='class-label'>Kelas</InputLabel>
            <Select labelId='class-label' label='Kelas' name='classId' value={form.classId} onChange={handleChange}>
              <MenuItem value=''>Pilih kelas</MenuItem>
              {classes.map(c => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
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

export default EditStudent
