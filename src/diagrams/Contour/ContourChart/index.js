import * as d3 from 'd3';
import React, { useRef, useEffect, useCallback } from 'react';

function ContourChart({ width, height, dataProp }){
    const ref = useRef();

    const draw = useCallback(() => {
        const data = dataProp;

        d3.select(ref.current).selectAll("*").remove();
        
        const svg = d3.select(ref.current)
            .attr("viewBox", [0, 0, width, height]);

        const margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 40
        };

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.x)).nice()
            .rangeRound([margin.left, width - margin.right]);


        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.y)).nice()
            .rangeRound([height - margin.bottom, margin.top]);

        const contours = d3.contourDensity()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .size([width, height])
            .bandwidth(30)
            .thresholds(30)
            (data);

        const yAxis = (g) => g.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y));

        const xAxis = g => g.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("y", -3)
                .attr("dy", null)
                .attr("font-weight", "bold")
                .text(data.x));

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .selectAll("path")
            .data(contours)
            .join("path")
            .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
            .attr("d", d3.geoPath());

        svg.append("g")
            .attr("stroke", "white")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 2);



    },[dataProp, height, width]);

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.attr("width", width).attr("height", height)
        .style("border", "1px solid black");
    }, [width, height]);

    useEffect(() => {
        draw();
    }, [dataProp, draw]);


    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>   
    )
}

export default ContourChart;