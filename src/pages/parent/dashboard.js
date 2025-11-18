import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const ParentDashboard = () => (
  <Box sx={{ p: 6 }}>
    <Typography variant='h4' sx={{ mb: 3 }}>
      Parent Dashboard
    </Typography>
    <Typography>Overview for parents: attendance, finance, announcements.</Typography>
  </Box>
)

export default ParentDashboard
