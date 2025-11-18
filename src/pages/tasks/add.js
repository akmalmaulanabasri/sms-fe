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

const AddTask = () => {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', subject_id: '', due_date: '' })
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    api
      .get('/api/subjects')
      .then(res => {
        const list = res && res.data ? res.data.results || res.data : res
        if (mounted) setSubjects(Array.isArray(list) ? list : [])
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
      await api.post('/api/tasks', form)
      router.push('/tasks')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, m: 3 }}>
      <CardHeader title={<Typography variant='h5'>Add Task</Typography>} />
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

export default AddTask
