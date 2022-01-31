import * as d3 from 'd3';

import React, { useState, useRef, useEffect, useCallback } from 'react';

const colors = {
  A: '#4aba00',
  B: '#e5bd00',
  C: '#f08f00',
  D: '#f1431c',
  F: '#b40000',
};

function DonutChart({ width, height, data }) {
  const ref = useRef();
  const [clicked, setClicked] = useState('Nothing');

  const draw = useCallback(() => {
    const svgContainer = d3.select(ref.current);

    const margin = 15;
    const center = Math.min(width, height) / 2;
    const radius = center - margin;

    svgContainer.select('svg').transition().duration(300).remove();
    // Create SVG
    const svg = svgContainer
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height])
      .append('g')
      .attr('transform', `translate(${center}, ${center})`);

    const pieGenerator = d3
      .pie()
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)
      .value((d) => d.value)
      .sort(null);

    const innerRadius = radius / 1.75;

    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(2)
      .padAngle(0.01);

    const arcGeneratorHover = d3
      .arc()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 2)
      .cornerRadius(1)
      .padAngle(0.005);

    const arcGeneratorActive = d3
      .arc()
      .innerRadius(innerRadius - 4)
      .outerRadius(radius + 4)
      .cornerRadius(1)
      .padAngle(0.005);

    // Donut
    const arcs = svg.selectAll().data(pieGenerator(data)).enter();

    let activeArcName = '';

    arcs
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d) => colors[d.data.name])
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', handleOnClickArc)
      .transition()
      .duration(700)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arcGenerator(d);
        };
      });

    function handleMouseOver(d, i) {
      if (activeArcName !== i.data.name) {
        d3.select(this).attr('d', arcGeneratorHover);
      }
    }

    function handleMouseOut(d, i) {
      if (activeArcName !== i.data.name) {
        d3.select(this).attr('d', arcGenerator);
      }
    }

    function handleOnClickArc(d, i) {
      arcs.selectAll('path').attr('d', arcGenerator);

      d3.select(this).attr('d', arcGeneratorActive);
      activeArcName = i.data.name;
      setClicked(activeArcName);
    }

    //Label
    arcs
      .append('g')
      .attr('transform', (d) => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x}, ${y})`;
      })
      .append('text')
      .text((d) => {
        return d.data.value;
      })
      .attr('y', 6)
      .style('fill', '#fff')
      .style('text-anchor', 'middle')
      .style('font-size', 0)
      .transition()
      .duration(700)
      .style('font-size', '10px');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, height]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.attr('width', width).attr('height', height);
  }, [width, height]);

  useEffect(() => {
    draw();
  }, [data, draw]);

  return (
    <>
      <p>
        Clicked: {` `} <b>{clicked}</b>
      </p>
      <div ref={ref}></div>
    </>
  );
}

export default DonutChart;
