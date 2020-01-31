import React from "react";
import {Grid, Paper, Avatar, Divider, Typography, Box} from "@material-ui/core";

function Banner(props) {
    const {icon, title, children, button} = props;
    return (
        <React.Fragment>
            <Paper elevation={0}>
                <Box pt={2} pr={1} pb={1} pl={2}>
                    <Grid spacing={2} container alignItems="center" wrap="nowrap">
                        <Grid item>
                            <Box bgcolor="primary.main" clone>
                                <Avatar>
                                    {icon}
                                </Avatar>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Typography>
                                {title}
                            </Typography>
                            {children}
                        </Grid>
                    </Grid>
                    <Grid container justify="flex-end" spacing={2}>
                        <Grid item>
                            {button}
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <Divider />
        </React.Fragment>
    );
}

export default Banner;
