import React from 'react';
import { 
  Table,
  TableCell, 
  TableRow, 
  TableBody, 
  TableHead, 
  TableContainer, 
  makeStyles, 
  createStyles, 
  withStyles, 
  Theme,
  Paper
} from '@material-ui/core';
import { fetchUserAsync, selectUsers } from './userSlice';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 200,
    maxWidth:500
  },
});

const UsersDetails = () => {
  const classes = useStyles();
  const {users, loading} = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  React.useEffect (() => {
    dispatch(fetchUserAsync())
  },[] );

  return (
    <>
      <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>User ID</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row:any) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}

export default UsersDetails;
