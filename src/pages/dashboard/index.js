import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from 'src/@core/utils/axios'
import CircularProgress from '@mui/material/CircularProgress'

const DashboardPage = () => {
  const [counts, setCounts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      api
        .get('/api/teachers')
        .then(r => r.data.length)
        .catch(() => 0),
      api
        .get('/api/students')
        .then(r => r.data.length)
        .catch(() => 0),
      api
        .get('/api/classes')
        .then(r => r.data.length)
        .catch(() => 0),
      api
        .get('/api/attendance/today')
        .then(r => r.data.length)
        .catch(() => 0),
      api
        .get('/api/billing')
        .then(r => r.data.length)
        .catch(() => 0)
    ])
      .then(([t, s, c, a, b]) => {
        if (!mounted) return
        setCounts({ teachers: t, students: s, classes: c, attendanceToday: a, billings: b })
      })
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant='h4' sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      {loading || !counts ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Link href='/teachers' passHref>
              <Card sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant='h6'>Teachers</Typography>
                  <Typography variant='h4'>{counts.teachers}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Link href='/students' passHref>
              <Card sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant='h6'>Students</Typography>
                  <Typography variant='h4'>{counts.students}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Link href='/classes' passHref>
              <Card sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant='h6'>Classes</Typography>
                  <Typography variant='h4'>{counts.classes}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Link href='/attendance' passHref>
              <Card sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant='h6'>Attendance Today</Typography>
                  <Typography variant='h4'>{counts.attendanceToday}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Link href='/billing' passHref>
              <Card sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant='h6'>Billings</Typography>
                  <Typography variant='h4'>{counts.billings}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default DashboardPage
