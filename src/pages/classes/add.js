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

const AddClass = () => {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', grade: '', homeroom_teacher_id: '' })
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    api
      .get('/api/teachers')
      .then(r => {
        const list = r && r.data ? r.data.results || r.data : r
        if (mounted) setTeachers(Array.isArray(list) ? list : [])
      })
      .catch(() => {})
      .finally(() => (mounted = false))
    return () => (mounted = false)
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/classes', form)
      router.push('/classes')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, m: 3 }}>
      <CardHeader title={<Typography variant='h5'>Add Class</Typography>} />
      <CardContent>
        <form onSubmit={submit}>
          <TextField fullWidth label='Name' name='name' value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label='Grade' name='grade' value={form.grade} onChange={handleChange} sx={{ mb: 2 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id='homeroom-label'>Homeroom Teacher</InputLabel>
            <Select
              labelId='homeroom-label'
              label='Homeroom Teacher'
              name='homeroom_teacher_id'
              value={form.homeroom_teacher_id}
              onChange={handleChange}
            >
              <MenuItem value=''>None</MenuItem>
              {teachers.map(t => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
        <Button type='submit' variant='contained' disabled={loading} onClick={submit}>
          {loading ? 'Saving…' : 'Save'}
        </Button>
      </CardActions>
    </Card>
  )
}

export default AddClass
