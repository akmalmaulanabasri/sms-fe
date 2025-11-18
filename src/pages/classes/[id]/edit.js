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
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const EditClass = () => {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({ name: '', grade: '', homeroom_teacher_id: '' })
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoading(true)
    Promise.all([api.get(`/api/classes/${id}`), api.get('/api/teachers')])
      .then(([cRes, tRes]) => {
        if (!mounted) return
        const cPayload = cRes && cRes.data ? cRes.data.results || cRes.data : cRes
        const classroom = cPayload && cPayload.results ? cPayload.results : cPayload
        const tPayload = tRes && tRes.data ? tRes.data.results || tRes.data : tRes
        const tList = Array.isArray(tPayload)
          ? tPayload
          : Array.isArray(tPayload.results)
          ? tPayload.results
          : Array.isArray(tPayload.data)
          ? tPayload.data
          : []

        setTeachers(tList)

        setForm({
          name: classroom.name || classroom.class_name || '',
          grade: classroom.grade || '',
          homeroom_teacher_id:
            (classroom.homeroomTeacher && classroom.homeroomTeacher.id) ||
            classroom.homeroom_teacher_id ||
            classroom.teacher_id ||
            ''
        })
      })
      .catch(err => console.error(err))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [id])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put(`/api/classes/${id}`, form)
      router.push('/classes')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, m: 3 }}>
      <CardHeader title={<Typography variant='h5'>Edit Class</Typography>} />
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

export default EditClass
