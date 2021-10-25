import * as d3 from 'd3';
import {
  Paragraph,
  HexGrade,
  Text,
  Inline,
  Button,
} from '@securityscorecard/design-system';
import styled from 'styled-components';

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
const ANIMATION_TIME = 500;
const LEGEND_FONT_SIZE = 12;

const ChartContainer = styled.div`
  position: relative;
`;

const TooltipContainer = styled.div`
  position: absolute;
  pointer-events: none;
  opacity: 0;
  z-index: 99;
  top: 0;
  left: 0;
`;

const TooltipPopup = styled.div`
  width: 120px;
  height: 60px;
  padding: 16px;
  background: #fff;
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.25));

  &::after {
    content: '';
    position: absolute;
    width: 0px;
    height: 0px;
    top: 50%;
    left: -5px;
    border-width: 5px 5px 5px 0px;
    border-color: transparent rgb(255, 255, 255) transparent transparent;
    border-style: solid;
  }
`;

function DoubleDonutChart({ width, height, data }) {
  const ref = useRef();
  const [selected, setSelected] = useState([]);
  const [hovered, setHovered] = useState({ grade: 'A', level: 0, value: 0 });
  const [activeLevel, setActiveLevel] = useState(1);

  const dataLevel1 = data.filter((entry) => entry.level === 1);
  const dataLevel2 = data.filter((entry) => entry.level === 2);

  const radius = height / 2;

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

  const arcsActive = [
    arcGenerator(innerR1 - 4 * ARC_EXPAND, outerR1),
    arcGenerator(innerR2 - 4 * ARC_EXPAND, outerR2),
  ];

  const draw = useCallback(() => {
    const svgContainer = d3.select(ref.current);

    // Clear SVG
    svgContainer.select('svg').transition().duration(100).remove();

    // Create SVG
    const svg = svgContainer
      .append('svg')
      .attr('width', `${width}px`)
      .attr('height', `${height}px`)
      .attr('viewBox', [0, 0, width, height])
      .attr('preserveAspectRatio', 'xMinYMin')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pieGenerator = d3
      .pie()
      .startAngle(START_ANGLE)
      .endAngle(END_ANGLE)
      .value((d) => d.value)
      .sort(null);

    // Donut
    const arcs1 = svg.selectAll().data(pieGenerator(dataLevel1)).enter();

    arcs1
      .append('path')
      .attr('d', arcs[0])
      .attr('class', 'arc-level-1')
      .attr('fill', (d) => colors[d.data.grade])
      .attr('opacity', activeLevel === 1 ? 1 : 0.7)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', handleOnClickArc)
      .transition()
      .duration(ANIMATION_TIME)
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
      .attr('opacity', activeLevel === 2 ? 1 : 0.7)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', handleOnClickArc)
      .transition()
      .duration(ANIMATION_TIME)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arcs[1](d);
        };
      });

    // Define the div for the tooltip
    const tooltipDiv = d3.select('.tooltip-container');
    setSelected([]);
    let selectedArcs = selected;

    // Interaction Functions

    function handleMouseOver(d, i) {
      if (activeLevel === i.data.level) {
        const currentArcActive = arcsActive[i.data.level - 1];
        d3.select(this).attr('d', currentArcActive);
        setHovered({
          grade: i.data.grade,
          level: i.data.level,
          value: i.data.value,
        });

        const [x, y] = currentArcActive.centroid(i);

        const tooltipX = x + width / 2 + 2 * LEGEND_FONT_SIZE;
        const tooltipY = y + height / 2 - 3 * LEGEND_FONT_SIZE;
        console.log(tooltipX, ' + ', tooltipY);
        tooltipDiv.style('left', tooltipX + 'px').style('top', tooltipY + 'px');
        tooltipDiv.transition().duration(200).style('opacity', 1);
      }
    }

    function handleMouseOut(d, i) {
      if (activeLevel === i.data.level) {
        const isArcSelected = selectedArcs.find(
          (arc) => arc.grade === i.data.grade && arc.level === i.data.level,
        );
        if (!isArcSelected) {
          d3.select(this).attr('d', arcs[i.data.level - 1]);
        }
        tooltipDiv.transition().duration(200).style('opacity', 0);
      }
    }

    function handleOnClickArc(d, i) {
      // d3.selectAll('.arc-level-1').attr('d', arcs[0]);
      // d3.selectAll('.arc-level-2').attr('d', arcs[1]);
      if (activeLevel === i.data.level) {
        d3.select(this).attr('d', arcsActive[i.data.level - 1]);
        const isArcSelected = selectedArcs.find(
          (arc) => arc.grade === i.data.grade && arc.level === i.data.level,
        );
        if (isArcSelected) {
          selectedArcs = selectedArcs.filter(
            (arc) => arc.grade !== i.data.grade || arc.level !== i.data.level,
          );
          setSelected(selectedArcs);
        } else {
          selectedArcs = [
            ...selectedArcs,
            { grade: i.data.grade, level: i.data.level },
          ];
          setSelected(selectedArcs);
        }
      }
    }

    //Labels

    arcs1
      .append('g')
      .attr('transform', (d) => `translate(${arcs[0].centroid(d)})`)
      .append('text')
      .text((d) => (d.data.percent > 5 ? d.data.percent + '%' : ''))
      .attr('y', LEGEND_FONT_SIZE / 2)
      .style('fill', '#fff')
      .style('text-anchor', 'middle')
      .style('font-size', 0)
      .transition()
      .duration(700)
      .style('font-size', `${LEGEND_FONT_SIZE}px`);

    arcs2
      .append('g')
      .attr('transform', (d) => `translate(${arcs[1].centroid(d)})`)
      .append('text')
      .text((d) => (d.data.percent > 5 ? d.data.percent + '%' : ''))
      .attr('y', LEGEND_FONT_SIZE / 2)
      .style('fill', '#fff')
      .style('text-anchor', 'middle')
      .style('font-size', 0)
      .transition()
      .duration(700)
      .style('font-size', `${LEGEND_FONT_SIZE}px`);
  }, [data, height, activeLevel]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.attr('width', width).attr('height', height);
  }, [width, height]);

  useEffect(() => {
    draw();
  }, [data, draw]);

  return (
    <>
      <Inline gap="lg">
        <Button
          variant="text"
          onClick={() => {
            setSelected([]);
            setActiveLevel(1);
          }}
        >
          &nbsp; 3rd Party &nbsp;
        </Button>
        <Button
          variant="text"
          onClick={() => {
            setSelected([]);
            setActiveLevel(2);
          }}
        >
          &nbsp; 4th Party &nbsp;
        </Button>
        <p>
          &nbsp;&nbsp;&nbsp; Selected: {` `}
          <b>{selected.map((arc) => arc.level + arc.grade + ' ')}</b>
        </p>
      </Inline>
      <ChartContainer>
        <div ref={ref}></div>
        <TooltipContainer className="tooltip-container">
          <TooltipPopup>
            <>
              <HexGrade
                grade={hovered.grade || null}
                variant="solid"
                size={24}
              />
              <Paragraph size="md" isBold margin={{ vertical: 0.5 }}>
                <Text isBold> {hovered.value} Companies </Text>
              </Paragraph>
            </>
          </TooltipPopup>
        </TooltipContainer>
      </ChartContainer>
    </>
  );
}

export default DoubleDonutChart;
