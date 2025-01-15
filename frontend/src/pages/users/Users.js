import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './users.css';
import Header from '../../components/header/Header';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import userRequest from '../../store/thunk/user/userRequest';
import deleteUserRequest from '../../store/thunk/user/deleteUserRequest';
import { TableFooter } from '@mui/material';
import UserOperation from './UserOperation';
import moment from 'moment';
import AlertDialog from '../../components/dialog/alertDialog';
import Snackbar from '../../components/snackbar/snackbar';

function Users() {
    const storeUser = useSelector(store => store.user);
    const [initialVal, setInitialVal] = useState([]);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [userData, setUserData] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showError, setShowError] = useState({isError:false,message:""});

    const dispatch = useDispatch();

    // Fetch data whenever page or rowsPerPage changes
    useEffect(() => {
        dispatch(userRequest({ limit: rowsPerPage, page: page + 1 }));
    }, [page, rowsPerPage]);

    // Update local state when store data changes
    useEffect(() => {
        if(storeUser.isError){
            setShowError({isError:storeUser.isError,message:storeUser.errorMessage});
        }
        setInitialVal(storeUser?.data || []);
        setCount(storeUser?.count || 0);
        console.log("storeUser:", storeUser)
    }, [storeUser]);

    const columns = [
        { id: 'name', label: 'Name', minWidth: "30%" },
        { id: 'email', label: 'Email', minWidth: "30%" },
        {
            id: 'dob',
            label: 'Date Of Birth',
            minWidth: "30%",
            align: 'left',
            format: (value) => moment(value).format('DD/MM/YYYY'),
        },
    ];

    function createData(id, name, email, dob) {
        return { id, name, email, dob };
    }

    // Create rows from initialVal
    const rows = initialVal.length > 0
        ? initialVal.map(val => createData(val._id, val.name, val.email, val.dob))
        : [];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleEdit = (user) => {
        console.log("user",user);
        setUserData(user);
        // Handle edit logic here
    };

    const handleDelete = (id) => {
        setUserData({});
        setSelectedId(id);
        setDialogOpen(true);
    };

    const handleCloseDialog = (confirmed) => {
        setDialogOpen(false);
        if (confirmed && selectedId) {
            console.log("Confirmed delete for ID:", selectedId);
            dispatch(deleteUserRequest(selectedId));
        }
        setSelectedId(null);
    };

    return (
        <>
            <Header />
            {showError.isError && <Snackbar isError={showError.isError} message={showError.message}/>}
            <UserOperation userData = {userData}/>
            <h3 className='m-3'>User List</h3>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{
                                            minWidth: column.minWidth,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell align="center" style={{ fontWeight: 700 }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length > 0 ? (
                                rows.map((row, index) => (
                                    <TableRow tabIndex={-1} key={index}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell align="center">
                                            <button
                                                onClick={() => handleEdit(row)}
                                                className='btn btn-success mx-4'
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className='btn btn-danger'
                                                onClick={() => handleDelete(row.id)}
                                            >
                                                Delete
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">
                                        No Data Available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableFooter>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableFooter>
            </Paper>

            {/* AlertDialog */}
            {dialogOpen && (
                <AlertDialog
                    openDialog={dialogOpen}
                    id={selectedId}
                    onClose={handleCloseDialog}
                />
            )}
        </>
    );
}

export default Users;
