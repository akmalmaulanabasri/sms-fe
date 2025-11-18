import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useState } from 'react'
import api from 'src/@core/utils/axios'
import { useRouter } from 'next/router'

const AddMaterial = () => {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', content: '', subject_id: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/learning-materials', form)
      router.push('/materials')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, m: 3 }}>
      <CardHeader title={<Typography variant='h5'>Add Material</Typography>} />
      <CardContent>
        <form onSubmit={submit}>
          <TextField fullWidth label='Title' name='title' value={form.title} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label='Content'
            name='content'
            value={form.content}
            onChange={handleChange}
            sx={{ mb: 2 }}
            multiline
            rows={6}
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

export default AddMaterial
