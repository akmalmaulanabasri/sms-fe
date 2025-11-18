import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const TeacherDashboard = () => (
  <Box sx={{ p: 6 }}>
    <Typography variant='h4' sx={{ mb: 3 }}>
      Teacher Dashboard
    </Typography>
    <Typography>Quick overview for teachers: schedule, tasks to grade, attendance summary.</Typography>
  </Box>
)

export default TeacherDashboard
