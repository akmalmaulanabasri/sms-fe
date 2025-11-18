import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import api from 'src/@core/utils/axios'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const GradesInput = () => {
  const [loading, setLoading] = useState(false)
  const [sample, setSample] = useState({ student: '', score: '' })

  const submit = e => {
    e.preventDefault()
    setLoading(true)
    api
      .post('/api/grades', sample)
      .then(() => {})
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  return (
    <Box sx={{ p: 6, maxWidth: 640 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Input Grades
      </Typography>
      <form onSubmit={submit}>
        <TextField
          fullWidth
          label='Student ID'
          name='student'
          value={sample.student}
          onChange={e => setSample({ ...sample, student: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label='Score'
          name='score'
          value={sample.score}
          onChange={e => setSample({ ...sample, score: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Button type='submit' variant='contained' disabled={loading}>
          Save
        </Button>
      </form>
    </Box>
  )
}

export default GradesInput
