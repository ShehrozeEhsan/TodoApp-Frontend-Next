import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

const TopNavBar = () => {
  const router = useRouter();
  

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    
      <Card
        sx={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          borderRadius: "20px",
          overflow: 'hidden',
        }}
      >
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item sm={0} md={4} lg={4}></Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                }}
              >
                Welcome
              </Typography>
            </Grid>
            <Grid item sm={0} md={3} lg={3}></Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={1}
              lg={1}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button variant="outlined" color="primary" onClick={handleLogout}>
                Logout
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    
  );
};

export default TopNavBar;
