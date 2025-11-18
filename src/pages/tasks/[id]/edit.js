import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useState, useEffect } from 'react'
import api from 'src/@core/utils/axios'
import { useRouter } from 'next/router'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const EditTask = () => {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({ title: '', description: '', subject_id: '', due_date: '' })
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    let mounted = true
    Promise.all([api.get(`/api/tasks/${id}`), api.get('/api/subjects')])
      .then(([tRes, sRes]) => {
        if (!mounted) return
        const tPayload = tRes && tRes.data ? tRes.data.results || tRes.data : tRes
        const task = tPayload && tPayload.results ? tPayload.results : tPayload
        const sPayload = sRes && sRes.data ? sRes.data.results || sRes.data : sRes
        setSubjects(Array.isArray(sPayload) ? sPayload : [])
        setForm({
          title: task.title || '',
          description: task.description || '',
          subject_id: task.subject_id || '',
          due_date: task.due_date ? task.due_date.split('T')[0] : ''
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
      await api.put(`/api/tasks/${id}`, form)
      router.push('/tasks')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, m: 3 }}>
      <CardHeader title={<Typography variant='h5'>Edit Task</Typography>} />
      <CardContent>
        <form onSubmit={submit}>
          <TextField fullWidth label='Title' name='title' value={form.title} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label='Description'
            name='description'
            value={form.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
            multiline
            rows={4}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id='subject-label'>Subject</InputLabel>
            <Select
              labelId='subject-label'
              label='Subject'
              name='subject_id'
              value={form.subject_id}
              onChange={handleChange}
            >
              <MenuItem value=''>None</MenuItem>
              {subjects.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label='Due Date'
            name='due_date'
            value={form.due_date}
            onChange={handleChange}
            sx={{ mb: 2 }}
            type='date'
            InputLabelProps={{ shrink: true }}
          />
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

export default EditTask
