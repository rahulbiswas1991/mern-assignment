import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './products.css';
import Header from '../../components/header/Header';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import productRequest from '../../store/thunk/product/productRequest';
import deleteProductRequest from '../../store/thunk/product/deleteProductRequest';
import { Select, TableFooter } from '@mui/material';
import ProductOperation from './ProductOperation';
import AlertDialog from '../../components/dialog/alertDialog';
import MenuItem from '@mui/material/MenuItem';
import SliderBar from '../../components/slider/slider';
import Snackbar from '../../components/snackbar/snackbar';

function Products() {
    const storeProduct = useSelector(store => store.product);
    const [initialVal, setInitialVal] = useState([]);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [productData, setProductData] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedFIlter, setSelectedFilter] = useState("filterUser");
    const [filterData, setFilterData] = useState({ user: "filterUser" });
    const [sliderVal, setSliderVal] = useState();
    const [showError, setShowError] = useState({ isError: false, message: "" });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(productRequest({ limit: rowsPerPage, page: page + 1 }));
    }, [page, rowsPerPage]);
    useEffect(() => {
        setFilterData({ ...filterData, value: sliderVal })
    }, [sliderVal]);

    useEffect(() => {
        if (storeProduct.isError) {
            setShowError({ isError: storeProduct.isError, message: storeProduct.errorMessage });
        }
        setInitialVal(storeProduct?.data || []);
        setCount(storeProduct?.count || 0);
    }, [storeProduct]);

    const columns = [
        { id: 'pname', label: 'Product name', minWidth: "25%" },
        { id: 'picture', label: 'Picture', minWidth: "25%" },
        {
            id: 'cost',
            label: 'Cost',
            minWidth: "25%",
            align: 'left',
        },
        { id: 'userName', label: 'User Name', minWidth: "25%" },
        { id: 'updatedAt', label: 'Updated At', minWidth: "25%", type: 'date' },
        { id: 'createdAt', label: 'Created At', minWidth: "25%", type: 'date' },
    ];

    function createData(id, pname, cost, picture, userName, userId, createdAt, updatedAt) {
        return { id, pname, cost, picture, userName, userId, createdAt, updatedAt };
    }

    const rows = initialVal.length > 0
        ? initialVal.map(val => createData(val._id, val.pname, val.cost, val.picture, val.userName, val.userId, val.createdAt, val.updatedAt))
        : [];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleEdit = (product) => {
        setProductData(product);
    };

    const handleDelete = (id) => {
        setSelectedId(id);
        setDialogOpen(true);
    };

    const handleCloseDialog = (confirmed) => {
        setDialogOpen(false);
        if (confirmed && selectedId) {
            dispatch(deleteProductRequest(selectedId));
        }
        setSelectedId(null);
    };
    const handleFilterData = (event) => {

        const { name, value } = event.target;
        if (name === "user") {
            setSelectedFilter(value);
        }
        setFilterData({
            ...filterData,
            [name]: value
        })
    }
    const handleFIlter = () => {
        dispatch(productRequest({ limit: rowsPerPage, page: page + 1, filterData }))
    }

    return (
        <>
            <Header />
            {showError.isError && <Snackbar isError={showError.isError} message={showError.message} />}
            <ProductOperation productData={productData} />
            <div className='d-flex flex-row justify-content-start align-items-center'>
                <h3 className='m-3'>Product List</h3>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedFIlter}
                    label="user"
                    onChange={handleFilterData}
                    displayEmpty
                    className='mx-3'
                    name='user'
                >
                    <MenuItem value="filterUser">
                        By user
                    </MenuItem>
                    <MenuItem value="filterProduct">
                        By product
                    </MenuItem>
                    <MenuItem value="filterCost">
                        By cost
                    </MenuItem>
                </Select>
                {filterData.user !== "filterCost"
                    ? <input type='text' name='searchInput' onChange={handleFilterData} placeholder='Search...' className='form-control mx-3 w-25' />
                    : <SliderBar setValue={setSliderVal} />
                }
                <button className='btn btn-primary mx-3' onClick={handleFIlter}>Filter</button>
            </div>
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
                                            if (column.id === 'picture') {
                                                return <TableCell key={column.id} align={column.align}>
                                                    {value ?
                                                        <img
                                                            src={`data:image/png;base64,${value}`}
                                                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                                            loading="lazy"
                                                        /> : "No image found"
                                                    }
                                                </TableCell>
                                            }
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

export default Products;
