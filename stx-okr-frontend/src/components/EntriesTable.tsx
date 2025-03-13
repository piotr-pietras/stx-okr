import { useState } from "react";
import { useEntries } from "../hooks/useEntries";
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
  TablePagination,
  CircularProgress,
  styled,
  Collapse,
  IconButton,
} from "@mui/material";
import { Entry, EntryStatus } from "../types/entry";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.grey[50],
  },
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.common.white,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StatusDot = styled("span")<{ status: EntryStatus }>(
  ({ status, theme }) => ({
    height: "10px",
    width: "10px",
    borderRadius: "50%",
    display: "inline-block",
    backgroundColor:
      status === EntryStatus.PENDING
        ? theme.palette.warning.main
        : status === EntryStatus.SENT
        ? theme.palette.success.main
        : theme.palette.error.main,
    marginRight: theme.spacing(1),
  })
);

interface ExpandableRowProps {
  entry: Entry;
}

const ExpandableRow = ({ entry }: ExpandableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "-";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <>
      <StyledTableRow>
        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            {entry.name}
          </Box>
        </TableCell>
        <TableCell align="center">
          <Box display="flex" alignItems="center" justifyContent="center">
            <StatusDot status={entry.status} />
            {entry.status}
          </Box>
        </TableCell>
        <TableCell align="center">{entry.done ? "Yes" : "No"}</TableCell>
        <TableCell sx={{ maxWidth: 200 }}>
          {truncateText(entry.description || "", 50)}
        </TableCell>
        <TableCell align="right">
          {entry.startDate
            ? new Date(entry.startDate).toLocaleDateString()
            : "-"}
        </TableCell>
        <TableCell align="right">
          {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : "-"}
        </TableCell>
        <TableCell align="right">
          {new Date(entry.createdAt).toLocaleDateString()}
        </TableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Full Description
              </Typography>
              <Typography>
                {entry.description || "No description available"}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const EntriesTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, isError } = useEntries({
    page: page + 1,
    pageSize: rowsPerPage,
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" p={4}>
        Error loading entries. Please try again later.
      </Typography>
    );
  }

  return (
    <Paper elevation={3}>
      <StyledTableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Done</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="right">Created At</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {data?.data.map((entry: Entry) => (
              <ExpandableRow key={entry.id} entry={entry} />
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.meta.total ?? 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
