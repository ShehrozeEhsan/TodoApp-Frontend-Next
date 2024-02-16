import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopNavBar from "./TopNavBar";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import RemoveIcon from "@mui/icons-material/Remove";
import axios, { AxiosError, AxiosResponse } from "axios";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#bfe0d7",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface Todo {
  index: number;
  todoId: number;
  content: string;
  createdAt: Date;
  completionStatus: boolean;
  userId: number;
}

const HomePage = () => {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [inCompleteTodos, setInCompleteTodos] = useState<Todo[]>([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [genericError, setGenericError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(-1);
  const [editingSuccess, setEditingSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleEditTask = async (todoId: number, content: string) => {
    setIsEditing(true);
    setEditingTodoId(todoId);
    setContent(content);
    setOpen(true);
  };

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setGenericError(false);
    setSuccess(false);
    setEditingSuccess(false);
  };

  const handleClose = () => {
    setOpen(false);
    setContent("");
    setEditingTodoId(-1);
    setIsEditing(false);
  };

  const handleEdit = async () => {
    try {
      const response: AxiosResponse = await axios.patch(
        "http://localhost:3000/todo/edit/" + editingTodoId,
        { content },
        { timeout: 5000 }
      );
      setEditingSuccess(true);
    } catch (error: any) {
      console.log(error);
      setGenericError(true);
    }
    handleClose();
    fetchData();
  };

  const handleSave = async () => {
    try {
      const userId: string | null = localStorage.getItem("userId");
      const response: AxiosResponse = await axios.post(
        "http://localhost:3000/todo/create-todo",
        { userId, content },
        { timeout: 5000 }
      );
      setSuccess(true);
    } catch (error: any) {
      console.log(error);
      setGenericError(true);
    }
    handleClose();
    fetchData();
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  useEffect(() => {
    const fullName: string | null = localStorage.getItem("fullName");
    const userId: string | null = localStorage.getItem("userId");
    if (fullName != null && userId != null) {
      setIsLoggedIn(true);
    } else {
      router.push("/login");
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsRequestLoading(true);
    setCompletedTodos([]);
    setInCompleteTodos([]);
    try {
      const response = await axios.get<Todo[]>(
        `http://localhost:3000/todo/get-all-pending/${localStorage.getItem(
          "userId"
        )}`
      );
      if (response.status != 204) {
        const mappedTodos: Todo[] = response.data.map(
          (todo: Todo, index: number) => ({
            index: index + 1,
            todoId: todo.todoId,
            content: todo.content,
            createdAt: new Date(todo.createdAt),
            completionStatus: todo.completionStatus,
            userId: todo.userId,
          })
        );
        setInCompleteTodos(mappedTodos);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }

    try {
      const response = await axios.get<Todo[]>(
        `http://localhost:3000/todo/get-all-completed/${localStorage.getItem(
          "userId"
        )}`
      );
      if (response.status != 204) {
        const mappedTodos: Todo[] = response.data.map(
          (todo: Todo, index: number) => ({
            index: index + 1,
            todoId: todo.todoId,
            content: todo.content,
            createdAt: new Date(todo.createdAt),
            completionStatus: todo.completionStatus,
            userId: todo.userId,
          })
        );
        setCompletedTodos(mappedTodos);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }

    setIsRequestLoading(false);
  };

  const changeStatusDone = async (todoId: number) => {
    try {
      const response: AxiosResponse = await axios.patch(
        "http://localhost:3000/todo/update-status/" + todoId,
        { timeout: 5000 }
      );
    } catch (error: any) {
      console.log(error);
      setGenericError(true);
    }
    fetchData();
  };

  const changeStatusPending = async (todoId: number) => {
    try {
      const response: AxiosResponse = await axios.patch(
        "http://localhost:3000/todo/update-status-to-pending/" + todoId,
        { timeout: 5000 }
      );
    } catch (error: any) {
      console.log(error);
      setGenericError(true);
    }
    fetchData();
  };

  const deleteTodo = async (todoId: number) => {
    try {
      const response: AxiosResponse = await axios.delete(
        "http://localhost:3000/todo/delete/" + todoId,
        { timeout: 5000 }
      );
    } catch (error: any) {
      console.log(error);
      setGenericError(true);
    }
    fetchData();
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          {isRequestLoading ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress />
              </div>
            </>
          ) : (
            <>
              <TopNavBar />
              <Grid container spacing={2}>
                <Grid item sm={12} md={12} lg={12}>
                  <Card
                    sx={{
                      marginTop: "2%",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                      borderRadius: "20px",
                      overflow: "hidden",
                    }}
                  >
                    <Grid container sx={{ margin: "1%" }}>
                      <Grid item xs={4} sm={0} md={0} lg={0}></Grid>
                      <Grid item xs={4} sm={11} md={11} lg={11}>
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          Todo
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={1} md={1} lg={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleOpen}
                        >
                          Add task
                        </Button>
                      </Grid>
                    </Grid>

                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: "95vw" }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow>
                            <StyledTableCell width="10%">Index</StyledTableCell>
                            <StyledTableCell width="50%">
                              Content
                            </StyledTableCell>
                            <StyledTableCell align="center" width="10%">
                              Status
                            </StyledTableCell>
                            <StyledTableCell align="center" width="30%">
                              Action
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {inCompleteTodos.map((row) => (
                            <StyledTableRow key={row.todoId}>
                              <StyledTableCell component="th" scope="row">
                                {row.index}
                              </StyledTableCell>
                              <StyledTableCell>{row.content}</StyledTableCell>
                              <StyledTableCell align="center">
                                {row.completionStatus ? (
                                  <HourglassEmptyIcon />
                                ) : (
                                  <HourglassEmptyIcon />
                                )}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Button
                                  variant="outlined"
                                  color="success"
                                  sx={{ marginRight: "2%" }}
                                  onClick={() => changeStatusDone(row.todoId)}
                                >
                                  <DoneIcon />
                                </Button>
                                <Button
                                  variant="outlined"
                                  sx={{ marginRight: "2%" }}
                                  onClick={() =>
                                    handleEditTask(row.todoId, row.content)
                                  }
                                >
                                  <EditIcon />
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => deleteTodo(row.todoId)}
                                >
                                  <DeleteIcon />
                                </Button>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Card>
                </Grid>
                <Grid item sm={12} md={12} lg={12}>
                  <Card
                    sx={{
                      marginTop: "2%",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                      borderRadius: "20px",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{
                        textAlign: "center",
                        margin: "1%",
                      }}
                    >
                      Completed
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: "95vw" }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow>
                            <StyledTableCell width="10%">Index</StyledTableCell>
                            <StyledTableCell width="50%">
                              Content
                            </StyledTableCell>
                            <StyledTableCell align="center" width="10%">
                              Status
                            </StyledTableCell>
                            <StyledTableCell align="center" width="30%">
                              Action
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {completedTodos.map((row) => (
                            <StyledTableRow key={row.todoId}>
                              <StyledTableCell component="th" scope="row">
                                {row.index}
                              </StyledTableCell>
                              <StyledTableCell>{row.content}</StyledTableCell>
                              <StyledTableCell align="center">
                                {row.completionStatus ? (
                                  <AssignmentTurnedInIcon />
                                ) : (
                                  <AssignmentTurnedInIcon />
                                )}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  sx={{ marginRight: "2%" }}
                                  onClick={() =>
                                    changeStatusPending(row.todoId)
                                  }
                                >
                                  <RemoveIcon />
                                </Button>
                                <Button
                                  variant="outlined"
                                  disabled
                                  sx={{ marginRight: "2%" }}
                                >
                                  <EditIcon />
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => deleteTodo(row.todoId)}
                                >
                                  <DeleteIcon />
                                </Button>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Card>
                </Grid>
              </Grid>
              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  maxWidth="md"
                  fullWidth
                >
                  {" "}
                  {isEditing ? (
                    <>
                      <DialogTitle>Edit Task</DialogTitle>
                    </>
                  ) : (
                    <>
                      <DialogTitle>Add new task</DialogTitle>
                    </>
                  )}
                  <DialogContent>
                    <TextField
                      margin="dense"
                      type="text"
                      fullWidth
                      multiline
                      rows={3}
                      value={content}
                      onChange={handleChange}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleEdit}
                          variant="contained"
                          color="primary"
                        >
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={handleSave}
                          variant="contained"
                          color="primary"
                        >
                          Save
                        </Button>
                      </>
                    )}
                  </DialogActions>
                </Dialog>
              </div>
              <Snackbar
                open={genericError}
                autoHideDuration={6000}
                onClose={handleAlertClose}
              >
                <Alert
                  onClose={handleAlertClose}
                  severity="error"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Unexpected Error.
                </Alert>
              </Snackbar>
              <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={handleAlertClose}
              >
                <Alert
                  onClose={handleAlertClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Successfully added new task
                </Alert>
              </Snackbar>
              <Snackbar
                open={editingSuccess}
                autoHideDuration={6000}
                onClose={handleAlertClose}
              >
                <Alert
                  onClose={handleAlertClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Successfully edited task
                </Alert>
              </Snackbar>
            </>
          )}
        </>
      ) : (
        <>
          <CircularProgress />
        </>
      )}
    </>
  );
};

export default HomePage;
