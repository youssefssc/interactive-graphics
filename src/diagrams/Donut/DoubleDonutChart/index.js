import * as d3 from 'd3';
import { getColor } from '@securityscorecard/design-system';

import React, { useState, useRef, useEffect, useCallback } from 'react';

const colors = {
  A: '#4aba00',
  B: '#e5bd00',
  C: '#f08f00',
  D: '#f1431c',
  F: '#b40000',
};

const START_ANGLE = 0;
const END_ANGLE = -Math.PI;
const CORNER_RADIUS = 0.5;
const PAD_ANGLE = 0.007;

const ARC_EXPAND = 2;

function DoubleDonutChart({ width, height, data }) {
  const ref = useRef();
  const [clicked, setClicked] = useState({ grade: '', level: 0 });

  const dataLevel1 = data.filter((entry) => entry.level === 1);
  const dataLevel2 = data.filter((entry) => entry.level === 2);

  const margin = 15;
  const center = Math.min(width, height) / 2;
  const radius = center - margin;

  const innerR1 = 0.5 * radius;
  const outerR1 = 0.7 * radius;

  const innerR2 = 0.8 * radius;
  const outerR2 = 1.0 * radius;

  const arcGenerator = (r, R) =>
    d3
      .arc()
      .innerRadius(r)
      .outerRadius(R)
      .cornerRadius(CORNER_RADIUS)
      .padAngle(PAD_ANGLE);

  const arcs = [arcGenerator(innerR1, outerR1), arcGenerator(innerR2, outerR2)];

  const arcsHover = [
    arcGenerator(innerR1 - ARC_EXPAND, outerR1 + ARC_EXPAND),
    arcGenerator(innerR2 - ARC_EXPAND, outerR2 + ARC_EXPAND),
  ];
  const arcsActive = [
    arcGenerator(innerR1 - 2 * ARC_EXPAND, outerR1 + 2 * ARC_EXPAND),
    arcGenerator(innerR2 - 2 * ARC_EXPAND, outerR2 + 2 * ARC_EXPAND),
  ];

  const draw = useCallback(() => {
    const svgContainer = d3.select(ref.current);

    // const svgContainer = d3.select(ref.current).node();
    // const width = svgContainer.getBoundingClientRect().width;
    // const height = width;

    svgContainer.select('svg').transition().duration(300).remove();
    // Create SVG
    const svg = svgContainer
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + width + ' ' + width)
      .attr('preserveAspectRatio', 'xMinYMin')
      .append('g')
      .attr('transform', `translate(${center}, ${center})`);

    const pieGenerator = d3
      .pie()
      .startAngle(START_ANGLE)
      .endAngle(END_ANGLE)
      .value((d) => d.value)
      .sort(null);

    // Donut
    const arcs1 = svg.selectAll().data(pieGenerator(dataLevel1)).enter();

    let activeArc = { level: 0, grade: '' };

    arcs1
      .append('path')
      .attr('d', arcs[0])
      .attr('class', 'arc-level-1')
      .attr('fill', (d) => colors[d.data.grade])
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', handleOnClickArc)
      .transition()
      .duration(700)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arcs[0](d);
        };
      });

    // Donut level 2
    const arcs2 = svg.selectAll().data(pieGenerator(dataLevel2)).enter();

    arcs2
      .append('path')
      .attr('d', arcs[1])
      .attr('class', 'arc-level-2')
      .attr('fill', (d) => colors[d.data.grade])
      .attr('opacity', 0.75)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', handleOnClickArc)
      .transition()
      .duration(700)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arcs[1](d);
        };
      });

    // Interaction Functions

    function handleMouseOver(d, i) {
      if (
        activeArc.grade !== i.data.grade ||
        activeArc.level !== i.data.level
      ) {
        d3.select(this).attr('d', arcsHover[i.data.level - 1]);
      }
    }

    function handleMouseOut(d, i) {
      if (
        activeArc.grade !== i.data.grade ||
        activeArc.level !== i.data.level
      ) {
        d3.select(this).attr('d', arcs[i.data.level - 1]);
      }
    }

    function handleOnClickArc(d, i) {
      d3.selectAll('.arc-level-1').attr('d', arcs[0]);
      d3.selectAll('.arc-level-2').attr('d', arcs[1]);

      d3.select(this).attr('d', arcsActive[i.data.level - 1]);
      activeArc = { grade: i.data.grade, level: i.data.level };
      setClicked(activeArc);
    }

    //Labels

    arcs1
      .append('g')
      .attr('transform', (d) => {
        const [x, y] = arcs[0].centroid(d);
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

    arcs2
      .append('g')
      .attr('transform', (d) => {
        const [x, y] = arcs[1].centroid(d);
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
  }, [data, height]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.attr('width', width).attr('height', height);
    // .style("border", "1px solid black")
  }, [width, height]);

  useEffect(() => {
    draw();
  }, [data, draw]);

  return (
    <>
      <p>
        Clicked: {` `} <b>{JSON.stringify(clicked)}</b>
      </p>
      <div ref={ref}></div>
    </>
  );
}

export default DoubleDonutChart;
