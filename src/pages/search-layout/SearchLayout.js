import { useState, Fragment, useLayoutEffect, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import NetworkGraph from '../network-graphs/NetworkGraph';
import * as d3 from 'd3';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: 0,
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};



export default function SearchLayout(props) {
    return (
        <Fragment>
            <CssBaseline />
            <HideOnScroll {...props}>
                <AppBar color="primary" enableColorOnDark>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ mr: 'auto' }}>
                            Search Engine
                        </Typography>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Toolbar />
            <Box sx={{ flexGrow: 1, m: 2 }}>
                <Item sx={{
                    width: '100%',
                    height: '100%',
                    overflow: 'auto'
                }}>
                    <Grid container direction={'row'} alignItems={'center'}>
                        <Grid item direction={'row'} sx={{ p: 2 }} xs={12}>
                            <Typography xs={4} component="div" variant="h5" sx={{ textAlign: 'initial', mr: 'auto' }}>
                                Search
                            </Typography>
                            <TextField
                                margin="normal"
                                disabled
                                required
                                xs={12}
                                sx={{ width: '100%' }}
                                id="name"
                                label={'Search'}
                                name="name"
                                type="text"
                                autoFocus
                                size={'small'}
                            />
                        </Grid>

                        <Grid item xs={12} alignItems={'center'} sx={{ height: 'calc(100vh - 100px)' }}>
                            <Item sx={{
                                width: '100%',
                                height: '100%',
                                overflow: 'auto'
                            }}>
                                <NetworkGraph></NetworkGraph>
                            </Item>
                        </Grid>
                    </Grid>
                </Item>
            </Box>
        </Fragment >
    );
}