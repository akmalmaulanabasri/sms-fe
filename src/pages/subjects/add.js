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
import Chip from '@mui/material/Chip'
import BoxMui from '@mui/material/Box'

const AddSubject = () => {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', grade: '', teachers: [] })
  const [teachersOptions, setTeachersOptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    api
      .get('/api/teachers')
      .then(res => {
        const list = res && res.data ? res.data.results || res.data : res
        if (mounted) setTeachersOptions(Array.isArray(list) ? list : [])
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
      const payload = { ...form }
      if (Array.isArray(payload.teachers)) payload.teachers = payload.teachers.map(t => Number(t))
      await api.post('/api/subjects', payload)
      router.push('/subjects')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, m: 3 }}>
      <CardHeader title={<Typography variant='h5'>Add Subject</Typography>} />
      <CardContent>
        <form onSubmit={submit}>
          <TextField fullWidth label='Name' name='name' value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label='Grade' name='grade' value={form.grade} onChange={handleChange} sx={{ mb: 2 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id='teachers-label'>Teachers</InputLabel>
            <Select
              labelId='teachers-label'
              label='Teachers'
              multiple
              name='teachers'
              value={form.teachers}
              onChange={e => setForm({ ...form, teachers: e.target.value })}
              renderValue={selected => (
                <BoxMui sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {selected.map(id => {
                    const t = teachersOptions.find(x => x.id === id || x.id === Number(id))
                    return <Chip key={id} label={t ? t.name : id} />
                  })}
                </BoxMui>
              )}
            >
              {teachersOptions.map(t => (
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

export default AddSubject
