import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  TablePagination,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { deleteProductRequest } from "@/redux/product/productSlice";

interface ProductsTableProps {
  products: Product[];
  status: string;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  page: number; // Added page prop
  rowsPerPage: number; // Added rowsPerPage prop
  totalElements: number; // Added totalElements prop
  onPageChange: (event: unknown, newPage: number) => void; // Added onPageChange prop
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const headerStyle: React.CSSProperties = {
  backgroundColor: "#f5f5f5",
  color: "#333333",
  fontWeight: "bold",
  fontSize: "0.9rem",
};

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  status,
  onEdit,
  onDelete,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [editId, setEditId] = useState<number | null>(null);
  console.log(
    "This is the products inside productstable component ",
    products,
    " this is the page number ",
    page,
    " this is the page size ",
    rowsPerPage,
    " and this is the total Elements inside ",
    totalElements
  );
  const displayedProducts = products.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  console.log("Displayed Products: ", displayedProducts);
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(8);

  const dispatch = useAppDispatch();

  const cellStyle: React.CSSProperties = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minWidth: "100px",
    maxWidth: "120px",
    position: "relative",
  };

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    onEdit(product);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        dispatch(deleteProductRequest(id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
    {products.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center" mt={4}>
            No products available
          </Typography>
        ) : (
      <TableContainer
        component={Paper}
        sx={{ mt: 2, height: "370px", overflowY: "scroll" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ textAlign: "center" }}>
              <TableCell style={headerStyle}>Name</TableCell>
              <TableCell style={headerStyle} sx={{ paddingLeft: "70px" }}>
                Description
              </TableCell>
              <TableCell style={headerStyle} sx={{ textAlign: "center" }}>
                Price
              </TableCell>
              <TableCell
                style={headerStyle}
                sx={{ textAlign: "center", paddingLeft: "20px" }}
              >
                Stock Quantity
              </TableCell>
              <TableCell style={headerStyle} sx={{ paddingLeft: "25px" }}>
                Brand
              </TableCell>
              <TableCell style={headerStyle} sx={{ paddingLeft: "15px" }}>
                Category
              </TableCell>
              <TableCell style={headerStyle} sx={{ paddingLeft: "30px" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status === "loading" ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell style={cellStyle} title={product.name}>
                    {product.name}
                  </TableCell>
                  <TableCell style={cellStyle} title={product.description}>
                    {product.description}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {product.price.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {product.stockQuantity}
                  </TableCell>
                  <TableCell>{product.brand.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell sx={{ paddingLeft: "10px" }}>
                    <IconButton onClick={() => handleEdit(product)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
        )}
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 8, 10]}
      />
    </>
  );
};

export default ProductsTable;
