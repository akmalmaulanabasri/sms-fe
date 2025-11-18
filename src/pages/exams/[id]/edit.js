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

const EditExam = () => {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({ name: '', description: '', date: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    let mounted = true
    api
      .get(`/api/exams/${id}`)
      .then(res => {
        const payload = res && res.data ? res.data.results || res.data : res
        if (mounted)
          setForm({
            name: payload.name || '',
            description: payload.description || '',
            date: payload.date ? payload.date.split('T')[0] : ''
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
      await api.put(`/api/exams/${id}`, form)
      router.push('/exams')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, m: 3 }}>
      <CardHeader title={<Typography variant='h5'>Edit Exam</Typography>} />
      <CardContent>
        <form onSubmit={submit}>
          <TextField fullWidth label='Name' name='name' value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
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
          <TextField
            fullWidth
            type='date'
            label='Date'
            name='date'
            value={form.date}
            onChange={handleChange}
            sx={{ mb: 2 }}
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

export default EditExam
