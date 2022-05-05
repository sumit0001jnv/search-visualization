import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import * as d3 from 'd3';

export default function NetworkGraph(props) {

    const [width, setWidth] = useState(1135);
    const [height, setHeight] = useState(455);
    const [dataset, setDataset] = useState(props.dataset || {});
    const margin = { top: 30, right: 80, bottom: 5, left: 5 }

    const colorScale = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
        .domain(["Team A", "Team B", "Team C", "Team D", "Team E"])
        .range(['#ff9e6d', '#86cbff', '#c2e5a0', '#fff686', '#9e79db'])

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink() // This force provides links between nodes
            .id(d => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
            .distance(120)
        )
        .force("charge", d3.forceManyBody().strength(-700)) // This adds repulsion (if it's negative) between nodes. 
        .force("center", d3.forceCenter(width / 2, height / 2));


    useEffect(() => {
        const width = document.querySelector("#svg-id").parentElement.parentElement.offsetWidth - 24 - (margin.left + margin.right);
        const height = document.querySelector("#svg-id").parentElement.parentElement.offsetHeight - 24 - (margin.top + margin.bottom);
        console.log(width, height)
        setWidth(() => width);
        setHeight(() => height);
        setTimeout(() => {
            onInitSvg();
        }, 1000);
        setDataset(() => (props.dataset || {}));
    }, []);

    useEffect(() => {
        setDataset(() => (props.dataset || {}));
        setTimeout(() => {
            onInitSvg();
        }, 1000);
    }, [props.dataset])

    function onInitSvg() {
        d3.select("#svg-id").selectAll("*").remove();
        const svg = d3.select("#svg-id")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append('defs').append('marker')
            .attr("id", 'arrowhead')
            .attr('viewBox', '-0 -0 12 12') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
            .attr('refX', 25) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
            .attr('refY', 6)
            .attr('orient', 'auto')
            .attr('markerWidth', 20)
            .attr('markerHeight', 30)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M2,2 L10,6 L2,10 L6,6 L2,2')
            .attr('fill', '#999')
            .style('stroke', 'none');


        ///gradeint
        // var gradient = svg.append("svg:defs")
        //     .append("svg:linearGradient")
        //     .attr("id", "gradient")
        //     .attr("x1", "0%")
        //     .attr("y1", "0%")
        //     .attr("x2", "100%")
        //     .attr("y2", "100%")
        //     .attr("spreadMethod", "pad");

        // // Define the gradient colors
        // gradient.append("svg:stop")
        //     .attr("offset", "0%")
        //     .attr("stop-color",d=> "#a00000")
        //     .attr("stop-opacity", 1);

        // gradient.append("svg:stop")
        //     .attr("offset", "100%")
        //     .attr("stop-color", "#aaaa00")
        //     .attr("stop-opacity", 1);



        const link = svg.selectAll(".links")
            .data(dataset.links)
            .enter()
            .append("line")
            .attr("class", "links")
            .attr('marker-end', 'url(#arrowhead)') //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.


        const edgepaths = svg.selectAll(".edgepath") //make path go along with the link provide position for link labels
            .data(dataset.links)
            .enter()
            .append('path')
            .attr('class', 'edgepath')
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .attr('id', function (d, i) { return 'edgepath' + i })
            .style("pointer-events", "none");

        const edgelabels = svg.selectAll(".edgelabel")
            .data(dataset.links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr('class', 'edgelabel')
            .attr('id', function (d, i) { return 'edgelabel' + i })
            .attr('font-size', 10)
            .attr('fill', '#aaa');

        edgelabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
            .attr('xlink:href', function (d, i) { return '#edgepath' + i })
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(d => d.type);


        link.attr("d", function (d) {
            return arcPath(false, d);
        });

        edgepaths.attr("d", function (d) {
            return arcPath(d.source.x < d.target.x, d);
        });

        edgelabels.attr("d", function (d) {
            return arcPath(d.source.x < d.target.x, d);
        });

        const node = svg.selectAll(".nodes")
            .data(dataset.nodes)
            .enter()
            .append("g")
            .attr("class", "nodes")
            .call(d3.drag() //sets the event listener for the specified typenames and returns the drag behavior.
                .on("start", dragstarted) //start - after a new pointer becomes active (on mousedown or touchstart).
                .on("drag", dragged)      //drag - after an active pointer moves (on mousemove or touchmove).
                .on("end", dragended)     //end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
            );

        // node.append("circle")
        //     .attr("r", d => 30)//+ d.runtime/20 )
        //     .style("stroke", "grey")
        //     // .style("stroke-opacity", 0.3)
        //     // .style("stroke-width", d => d.runtime / 10)
        //     .style("fill", d => colorScale(d.group))
        /***
         * 
         * 
         * 
         */

        var customSymbolHexagon = {
            draw: function (context, size) {
                let s = Math.sqrt(size) / 2;
                // M 0 0 L 1 0 L 2 1 L 1 2 L 0 2 L -1 1 L 0 0
                // context.moveTo(s, s);
                // context.lineTo(s, -s);
                // context.lineTo(s, -s);
                // context.lineTo(-s, -s);
                // context.lineTo(-s, -s);
                // context.lineTo(-s, s);

                context.moveTo(s, 0);
                context.lineTo(s / 2, (Math.sqrt(3) * s) / 2);
                context.lineTo(-s / 2, (Math.sqrt(3) * s) / 2);
                context.lineTo(-s, 0);
                context.lineTo(-s / 2, -(Math.sqrt(3) * s) / 2);
                context.lineTo(s / 2, -(Math.sqrt(3) * s) / 2);
                context.lineTo(s, 0);


                context.closePath();
            }
        }

        const customHex = d3.symbol().type(customSymbolHexagon).size(3000);
        node.append("path")
            .attr("d", customHex)
            // .style("stroke", "grey")
            .style("filter", "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))")
            .style("fill", d => colorScale(d.group))
        // .style("fill", "#ccc")
        // .attr("transform", "translate(0,0)")

        /**** */

        // node.append("title")
        //     .text(d => d.id + ": " + d.label + " - " + d.group + ", runtime:" + d.runtime + "min");

        node.on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        node.append("text")
            .attr("dy", 4)
            // .attr("dx", -15)
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .text(d => d.name);
        node.append("text")
            .attr("dy", 14)
            // .attr("dx", -8)
            .style("font-size", "10px")
            .style("text-anchor", "middle")
            .text(d => d.runtime);

        //Listen for tick events to render the nodes as they update in your Canvas or SVG.

        simulation
            .nodes(dataset.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(dataset.links);




        // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).
        function ticked() {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            link.attr("d", function (d) {
                return arcPath(d.source.x < d.target.x, d);
            });



            node.attr("transform", d => `translate(${d.x},${d.y})`);

            edgepaths.attr('d', d => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
        }

        //When the drag gesture starts, the targeted node is fixed to the pointer
        //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
            simulation.force("link", null).force("charge", null).force("center", null);
            d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
            d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
        }

        //When the drag gesture starts, the targeted node is fixed to the pointer
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        //the targeted node is released when the gesture ends
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;

            console.log("dataset after dragged is ...", dataset);
        }

        //drawing the legend
        // const legend_g = svg.selectAll(".legend")
        //     .data(colorScale.domain())
        //     .enter().append("g")
        //     .attr("transform", (d, i) => `translate(${width},${i * 20})`);

        // legend_g.append("circle")
        //     .attr("cx", 0)
        //     .attr("cy", 0)
        //     .attr("r", 5)
        //     .attr("fill", colorScale);

        // legend_g.append("text")
        //     .attr("x", 10)
        //     .attr("y", 5)
        //     .text(d => d);

        //drawing the second legend
        // const legend_g2 = svg.append("g")
        //     //.attr("transform", (d, i) => `translate(${width},${i * 20})`); 
        //     .attr("transform", `translate(${width}, 120)`);

        // legend_g2.append("circle")
        //     .attr("r", 5)
        //     .attr("cx", 0)
        //     .attr("cy", 0)
        //     .style("stroke", "grey")
        //     .style("stroke-opacity", 0.3)
        //     .style("stroke-width", 15)
        //     .style("fill", "black")
        // legend_g2.append("text")
        //     .attr("x", 15)
        //     .attr("y", 0)
        //     .text("long runtime");

        // legend_g2.append("circle")
        //     .attr("r", 5)
        //     .attr("cx", 0)
        //     .attr("cy", 20)
        //     .style("stroke", "grey")
        //     .style("stroke-opacity", 0.3)
        //     .style("stroke-width", 2)
        //     .style("fill", "black")
        // legend_g2.append("text")
        //     .attr("x", 15)
        //     .attr("y", 20)
        //     .text("short runtime");

        var zoom_handler = d3.zoom()
            .on("zoom", zoom_actions);

        zoom_handler(d3.select("#svg-id"));
        function zoom_actions() {
            svg.attr("transform", d3.zoomTransform(this))
        }

        const Tooltip = d3.select("body")
            .append("div")
            .style("display", 'none')
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        function arcPath(leftHand, d) {
            console.log("leftHand", leftHand);
            var start = leftHand ? d.source : d.target,
                end = leftHand ? d.target : d.source,
                dx = end.x - start.x,
                dy = end.y - start.y,
                dr = Math.sqrt(dx * dx + dy * dy),
                sweep = leftHand ? 0 : 1;
            return "M" + start.x + "," + start.y + "A" + dr + "," + dr +
                " 0 0," + sweep + " " + end.x + "," + end.y;
        }

        function mouseover(d) {
            Tooltip
                // .style("opacity", 1)
                .style("display", 'block')
            d3.select(this)
                .style("stroke", "black")
            // .style("opacity", 1)
        }
        function mousemove(event, d) {
            //d3.pointer(event,this.state.svg.node());
            Tooltip
                .html(`<div style="display:flex;flex-direction:column;font-size:12px;color: #9e9e9e;font-weight:400">
                <div>Name: ${d.name}</div>
                <div>Label: ${d.label}</div>
                <div>Runtime: ${d.runtime}</div>
                </div>`)
                .style("left", (event.pageX + 30) + "px")
                .style("top", (event.pageY) + "px")
                .style("border", "1px solid " + colorScale(d.group))
                .style("border-top", "4px solid " + colorScale(d.group))
        }
        function mouseleave(d) {
            Tooltip
                .style("display", 'none')
            d3.select(this)
                .style("stroke", "none")
            // .style("opacity", 0.8)
        }
    }
    return (
        <Box id='svg-container' sx={{ flexGrow: 1 }}
        >
            <svg id="svg-id" style={{ boxShadow: "0px 0px 8px 4px #e3f2fd inset" }}>
            </svg>
        </Box>
    );
}