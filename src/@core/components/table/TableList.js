import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import api from 'src/@core/utils/axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'

const TableList = ({
  title,
  rows = [],
  columns = [],
  loading = false,
  addLink,
  onEdit,
  onDelete,
  deleteEndpoint, // optional endpoint string, e.g. '/api/teachers'
  onDeleted // optional callback after deletion: (row) => void
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleOpenConfirm = row => {
    setSelectedRow(row)
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    setConfirmOpen(false)
    setSelectedRow(null)
  }

  const handleConfirmDelete = async () => {
    if (!selectedRow) return
    setDeleting(true)
    try {
      if (onDelete) {
        await onDelete(selectedRow)
      } else if (deleteEndpoint) {
        await api.delete(`${deleteEndpoint}/${selectedRow.id}`)
        if (onDeleted) onDeleted(selectedRow)
      }
    } catch (err) {
      // swallow – pages can show notification via onDelete/onDeleted if needed
      // console.error(err)
    } finally {
      setDeleting(false)
      handleCloseConfirm()
    }
  }

  return (
    <Card>
      {title && (
        <CardHeader
          title={<Typography variant='h4'>{title}</Typography>}
          action={
            addLink ? (
              <Link href={addLink}>
                <IconButton size='small' aria-label='add'>
                  <Icon icon='tabler:plus' />
                </IconButton>
              </Link>
            ) : null
          }
        />
      )}

      <CardContent sx={{ p: title ? 2 : 3 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader aria-label='table-list'>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell key={col.id} sx={{ minWidth: col.minWidth }}>
                      {col.label}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || deleteEndpoint) && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    {columns.map(col => (
                      <TableCell key={col.id}>{col.render ? col.render(row) : row[col.id]}</TableCell>
                    ))}
                    {(onEdit || onDelete || deleteEndpoint) && (
                      <TableCell>
                        {onEdit && (
                          <IconButton size='small' onClick={() => onEdit(row)}>
                            <Icon fontSize='1rem' icon='tabler:pencil' />
                          </IconButton>
                        )}
                        {(onDelete || deleteEndpoint) && (
                          <IconButton size='small' onClick={() => handleOpenConfirm(row)}>
                            <Icon fontSize='1rem' icon='tabler:trash' />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>

      {!loading && (
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardActions>
      )}

      <Dialog open={confirmOpen} onClose={handleCloseConfirm} fullWidth maxWidth='xs'>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} disabled={deleting}>
            Cancel
          </Button>
          <Button
            color='error'
            onClick={handleConfirmDelete}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={14} /> : null}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default TableList
