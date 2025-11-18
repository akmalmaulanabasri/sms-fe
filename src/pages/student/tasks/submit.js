import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import api from 'src/@core/utils/axios'

const SubmitTask = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = e => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    const fd = new FormData()
    fd.append('file', file)
    api
      .post('/api/tasks/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {})
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  return (
    <Box sx={{ p: 6, maxWidth: 640 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Submit Task
      </Typography>
      <form onSubmit={submit}>
        <Button variant='contained' component='label'>
          Upload File
          <input type='file' hidden onChange={e => setFile(e.target.files[0])} />
        </Button>
        <TextField fullWidth disabled value={file ? file.name : ''} sx={{ mt: 2, mb: 2 }} />
        <Button type='submit' variant='contained' disabled={loading}>
          {loading ? 'Submitting…' : 'Submit'}
        </Button>
      </form>
    </Box>
  )
}

export default SubmitTask
