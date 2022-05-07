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
    const allData = {
        nodes: [
            { id: 1, name: 'AGGR', label: 'Final Calc/Aggregation', group: 'Team C', runtime: 20 },
            { id: 2, name: 'ASMT', label: 'State Data/Assessment Repository', group: 'Team B', runtime: 60 },
            { id: 3, name: 'CALC', label: 'Reporting/Final Calc', group: 'Team C', runtime: 30 },
            { id: 4, name: 'DEMOFDDGGGD', label: 'Snapshot/Demographic', group: 'Team A', runtime: 40 },
            { id: 5, name: 'ELIG', label: 'State Data/Eligibility', group: 'Team B', runtime: 20 },
            { id: 6, name: 'GOAL', label: 'MOSL/Goal Setting', group: 'Team D', runtime: 60 },
            { id: 7, name: 'GROW', label: 'MOSL/Growth Model', group: 'Team D', runtime: 60 },
            { id: 8, name: 'LINK DFSSD', label: 'Snapshot/Linkage', group: 'Team A', runtime: 100 },
            { id: 9, name: 'MOSL', label: 'Reporting/MOSL', group: 'Team D', runtime: 80 },
            { id: 10, name: 'MOTP', label: 'Final Calc/MOTP', group: 'Team C', runtime: 20 },
            { id: 11, name: 'REPTFFF', label: 'Reportingsgfs', group: 'Team E', runtime: 240 },
            { id: 12, name: 'SEDD', label: 'Reporting/State Data', group: 'Team B', runtime: 30 },
            { id: 13, name: 'SNAP', label: 'Reporting/Snapshot', group: 'Team A', runtime: 40 },
            { id: 14, name: 'PTRN', label: 'State Data/pattern', group: 'Team B', runtime: 40 }
        ],
        links: [
            { source: 3, target: 1, type: 'Next -->>' },
            // { source: 6, target: 1, type: 'Next -->>' },
            // { source: 1, target: 7, type: 'Next -->>' },
            // { source: 9, target: 1, type: 'Next -->>' },
            { source: 13, target: 8, type: 'Next -->>' },
            // { source: 2, target: 6, type: 'Next -->>' },
            // { source: 2, target: 7, type: 'Next -->>' },
            // { source: 2, target: 8, type: 'Next -->>' },
            // { source: 2, target: 9, type: 'Next -->>' },
            { source: 3, target: 10, type: 'Next -->>' },
            { source: 11, target: 3, type: 'Next -->>' },
            // { source: 8, target: 5, type: 'Go to ->>' },
            // { source: 8, target: 11, type: 'Go to ->>' },
            { source: 9, target: 6, type: 'Go to ->>' },
            { source: 9, target: 7, type: 'Go to ->>' },
            // { source: 8, target: 9, type: 'Go to ->>' },
            { source: 11, target: 9, type: 'Go to ->>' },
            { source: 11, target: 12, type: 'Go to ->>' },
            { source: 12, target: 5, type: 'Go to ->>' },
            { source: 12, target: 14, type: 'Go to ->>' },
            { source: 12, target: 2, type: 'Go to ->>' },
            // { source: 12, target: 9, type: 'Go to ->>' },
            { source: 11, target: 13, type: 'Go to ->>' },
            // { source: 2, target: 13, type: 'Go to ->>' },
            { source: 13, target: 4, type: 'This way>>' },
            // { source: 13, target: 5, type: 'This way>>' },
            // { source: 13, target: 8, type: 'This way>>' },
            // { source: 13, target: 9, type: 'This way>>' },
            // { source: 13, target: 10, type: 'This way>>' },
            // { source: 4, target: 7, type: 'Next -->>' },
            // { source: 4, target: 2, type: 'Next -->>' }
        ]
    }
    const [dataset, setDataset] = useState(allData);
    // searchTree()
    const searchTree = (event) => {
        console.log(event.target.value);
        const text = event.target.value;
        let nodes = (allData.nodes || []).filter(n => n.label.toLocaleLowerCase().includes((text || '').toLocaleLowerCase()) || n.name.toLocaleLowerCase().includes((text || '').toLocaleLowerCase()));
        let links = (allData.links || []).filter(n => nodes.map(n => n.id).includes(n.source) && nodes.map(n => n.id).includes(n.target));
        setDataset((set) => { return { ...set, nodes, links } })
    }

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    const processChange = (event) => debounce(() => searchTree(event));
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
                            {/* <Typography xs={4} component="div" variant="h5" sx={{ textAlign: 'initial', mr: 'auto' }}>
                                Search
                            </Typography> */}
                            <TextField
                                margin="normal"
                                required
                                xs={12}
                                sx={{ width: '100%', bgcolor: "#fff" }}
                                id="name"
                                label={'Search'}
                                name="name"
                                type="text"
                                autoFocus
                                size={'small'}
                                onKeyUp={searchTree}
                            />
                        </Grid>

                        <Grid item xs={12} alignItems={'center'} sx={{ height: 'calc(100vh - 100px)' }}>
                            <Item sx={{
                                width: '100%',
                                height: '100%',
                                overflow: 'auto'
                            }}>
                                <NetworkGraph dataset={dataset}></NetworkGraph>
                            </Item>
                        </Grid>
                    </Grid>
                </Item>
            </Box>
        </Fragment >
    );
}