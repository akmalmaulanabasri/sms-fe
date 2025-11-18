import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import api from 'src/@core/utils/axios'
import { useAuth } from 'src/hooks/useAuth'

const ProfilePage = () => {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState(user || { name: '', email: '' })
  const [loading, setLoading] = useState(false)
  useEffect(() => setForm(user || { name: '', email: '' }), [user])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const save = e => {
    e.preventDefault()
    setLoading(true)
    api
      .put('/api/auth/me', form)
      .then(res => {
        setUser(res.data.user || form)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  return (
    <Box sx={{ p: 6, maxWidth: 640 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Profile
      </Typography>
      <form onSubmit={save}>
        <TextField fullWidth name='name' label='Name' value={form.name || ''} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField
          fullWidth
          name='email'
          label='Email'
          value={form.email || ''}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button type='submit' variant='contained' disabled={loading}>
          {loading ? 'Saving…' : 'Save'}
        </Button>
      </form>
    </Box>
  )
}

export default ProfilePage
