import React, { useState } from "react";
import {
  Grid,
  Modal,
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios, { AxiosError, AxiosResponse } from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [genericError, setGenericError] = useState(false);
  const [authenticationError, setAuthenticationError] = useState(false);
  const [userNotFoundError, setUserNotFoundError] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setUserNotFoundError(false);
    setGenericError(false);
    setAuthenticationError(false);
  };

  const handleLogin = async () => {
    event.preventDefault();
    setIsRequestLoading(true);
    try {
      const response: AxiosResponse = await axios.post(
        "http://192.168.100.35:3000/user/login",
        { username, password },
        { timeout: 5000 }
      );
      localStorage.setItem("fullName", response.data.fullName);
      localStorage.setItem("userId", response.data.userId);
      await router.push("/homepage");
    } catch (error: any) {
      console.log(error);
      if (error.response != null){
        if (error.response.status == 401) {
          setAuthenticationError(true);
        } else if (error.response.status == 404) {
          setUserNotFoundError(true);
        } else {
          setGenericError(true);
        } 
      } else {
        setGenericError(true);
      }
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "90vh" }}
    >
      <Grid item sm={1} md={4.5} lg={4.5}></Grid>
      <Grid item xs={10} sm={6} md={3} lg={3}>
        <Card
          sx={{
            boxShadow: 10,
            borderRadius: 4,
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                textAlign: "center",
                marginBottom: "5%",
              }}
            >
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                placeholder="Username"
                variant="outlined"
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ marginBottom: 16 }}
              />
              <TextField
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{ marginBottom: 16 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                disabled={isRequestLoading}
              >
                {" "}
                {isRequestLoading ? (
                  <>
                    <CircularProgress color="secondary" />
                  </>
                ) : (
                  <>Login</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item sm={1} md={4.5} lg={4.5}></Grid>
      <Snackbar
        open={genericError}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Error, Please try again later.
        </Alert>
      </Snackbar>
      <Snackbar
        open={authenticationError}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Wrong Password.
        </Alert>
      </Snackbar>
      <Snackbar
        open={userNotFoundError}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Account not found.
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default LoginPage;
