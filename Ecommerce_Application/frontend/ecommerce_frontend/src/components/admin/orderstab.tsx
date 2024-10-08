import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Select,
  CircularProgress,
  SelectChangeEvent,
  PaginationItem,
  Pagination,
  Tooltip,
  FormControl,
  InputLabel,
  TextField,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  cancelOrderRequest,
  fetchAllOrdersRequest,
  updateOrderRequest,
} from "@/redux/order/orderSlice";
import CircularLoader from "../loader";

const statusOptions = ["Dispatched", "Delivered", "Ordered", "Cancelled"];
const sortOptions = ["Newest First", "Oldest First"];

const statusColors: StatusColors = {
  Ordered: "#ffeb3b",
  Dispatched: "#2196f3",
  Delivered: "#4caf50",
  Cancelled: "#f44336",
};

const OrdersTab = () => {
  const dispatch = useAppDispatch();
  const {
    orders,
    status: orderStatus,
    error,
    totalItems,
  } = useAppSelector((state) => state.order);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tempSearchQuery, setTempSearchQuery] = useState<string>("");

  useEffect(() => {
    const sortDescending = sortOrder === "Newest First";
    dispatch(
      fetchAllOrdersRequest({
        pageSize: rowsPerPage,
        pageNumber: page + 1,
        sortDescending: sortDescending,
        status: statusFilter === "All Statuses" ? undefined : statusFilter,
        keyword: searchQuery,
      })
    );
  }, [dispatch, page, rowsPerPage, sortOrder, statusFilter, searchQuery]);

  useEffect(() => {
    setHasMore(orders.length === rowsPerPage);
  }, [orders, rowsPerPage]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      dispatch(updateOrderRequest({ orderId, status: newStatus }));
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleDropdownChange = (
    event: SelectChangeEvent<string>,
    orderId: number
  ) => {
    const newStatus = event.target.value;
    handleStatusChange(orderId, newStatus);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchQuery(tempSearchQuery);
    }
  };

  const cellStyle: React.CSSProperties = {
    backgroundColor: "#f5f5f5",
    color: "#333333",
    fontWeight: "bold",
    fontSize: "0.9rem",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  if (orderStatus === "loading") {
    console.log("Inside loader fuction ");
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // minHeight: '90vh',
      }}
    >
      <Box
        p={3}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          paddingBottom: "2px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="h6">Manage Orders</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Search"
              value={tempSearchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTempSearchQuery(e.target.value)
              }
              onKeyDown={handleKeyDown}
              size="small"
              sx={{ width: 200 }}
            />
            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel id="sort-order-label">Sort</InputLabel>
              <Select
                label="Sort"
                value={sortOrder}
                onChange={handleSortChange}
                sx={{ fontSize: "0.875rem" }}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                sx={{ fontSize: "0.875rem" }}
              >
                <MenuItem value="All Statuses">All Statuses</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {orders.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center" mt={4}>
            No orders available
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ height: "370px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={cellStyle}>Order ID</TableCell>
                  <TableCell sx={{ paddingLeft: "35px" }} style={cellStyle}>
                    User Email
                  </TableCell>
                  <TableCell style={cellStyle}>Ordered Date</TableCell>
                  <TableCell sx={{ textAlign: "center" }} style={cellStyle}>
                    Total Amount
                  </TableCell>
                  <TableCell sx={{ paddingLeft: "60px" }} style={cellStyle}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.user.email}</TableCell>
                    <TableCell sx={{ paddingLeft: "25px" }}>
                      {formatDate(order.orderedAt)}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {order.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onChange={(e) => handleDropdownChange(e, order.id)}
                        sx={{ width: 150, fontSize: "0.875rem" }}
                      >
                        {statusOptions.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                      <Box
                        sx={{
                          display: "inline-block",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor:
                            statusColors[order.status] || "#ffffff",
                          marginLeft: "10px",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>
      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 8, 10]}
      />
    </Box>
  );
};

export default OrdersTab;
