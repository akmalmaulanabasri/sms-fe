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

const EditSubject = () => {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({ name: '', grade: '', teachers: [] })
  const [teachersOptions, setTeachersOptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    let mounted = true
    Promise.all([api.get(`/api/subjects/${id}`), api.get('/api/teachers')])
      .then(([sRes, tRes]) => {
        if (!mounted) return
        const sPayload = sRes && sRes.data ? sRes.data : sRes
        const subject = sPayload && sPayload.results ? sPayload.results : {}
        const tPayload = tRes && tRes.data ? tRes.data.results || tRes.data : tRes
        const teachers = Array.isArray(tPayload) ? tPayload : Array.isArray(tPayload.results) ? tPayload.results : []
        setTeachersOptions(teachers)
        setForm({
          name: subject.name || '',
          grade: subject.grade || '',
          teachers: Array.isArray(subject.teachers)
            ? subject.teachers.map(t => t.id)
            : Array.isArray(subject.Teachers)
            ? subject.Teachers.map(t => t.id)
            : []
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
      if (Array.isArray(payload.teachers)) payload.teachers = payload.teachers.map(t => Number(t))
      await api.put(`/api/subjects/${id}`, payload)
      router.push('/subjects')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, m: 3 }}>
      <CardHeader title={<Typography variant='h5'>Edit Subject</Typography>} />
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

export default EditSubject
