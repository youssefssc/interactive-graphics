import React, { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { HexGrade, getColor, pxToRem } from '@securityscorecard/design-system';
import styled from 'styled-components';

const MAX_LINKS = 30;

const ChartContainer = styled.div`
  position: relative;
  max-width: 800px;
  max-height: 800px;
`;

const CompanyLink = styled.div`
  position: absolute;
  color: ${getColor('graphite4B')};
  width: 267px; // = 800/3
  text-align: center;
  left: ${({ x }) => pxToRem(x)};
  top: ${({ y }) => pxToRem(y)};
  animation:1s ease 0s normal forwards fadein;
  -webkit-animation:1s ease 0s normal forwards fadein;
  opacity:1;
  }

  @keyframes fadein{
      0%{opacity:0}
      50%{opacity:0.5}
      100%{opacity:1}
  }

  @-webkit-keyframes fadein{
      0%{opacity:0}
      50%{opacity:0.5}
      100%{opacity:1}
}
`;

function mapRange(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

const calcHeights = (data, height) => {
  let heights = [height / 2];
  const size = data.length;
  const totalLinksHeight = (size * height) / MAX_LINKS;
  const heightStart = height / 2 - totalLinksHeight / 2;
  const heightEnd = height / 2 + totalLinksHeight / 2;

  if (size > 1) {
    heights = data.map((link, i) => {
      return mapRange(i, 0, size - 1, heightStart, heightEnd);
    });
  }
  return heights;
};

const prepData = (heights, height, width) => {
  const parsed = [];
  heights.forEach((y) => {
    parsed.push(
      {
        source: [0, height / 2],
        target: [width / 3, y],
      },
      {
        source: [(2 * width) / 3, y],
        target: [width, height / 2],
      },
    );
    return y;
  });
  return parsed;
};

function LinksChart({ width, height, data }) {
  const heights = calcHeights(data, height);
  const ref = useRef();

  const draw = useCallback(() => {
    const svgContainer = d3.select(ref.current);

    svgContainer.select('svg').transition().duration(300).remove();
    // Create SVG
    const svg = svgContainer
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height])
      .append('g');

    const dataReady = prepData(heights, height, width);

    // Horizontal link generator
    var link = d3
      .linkHorizontal()
      .source(function (d) {
        return [d.source[0], d.source[1]];
      })
      .target(function (d) {
        return [d.target[0], d.target[1]];
      });

    // Adding the link paths
    const links = svg.selectAll().data(dataReady).enter();

    links
      .append('path')
      .attr('d', link)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.25)
      .classed('link', true)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);
  }, [height, heights, width]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.attr('width', width).attr('height', height);
  }, [width, height]);

  useEffect(() => {
    draw();
  }, [data, height, draw]);

  return (
    <ChartContainer>
      <div ref={ref}></div>
      {data.map((link, i) => (
        <CompanyLink key={i} x={width / 3} y={heights[i] - 14}>
          <HexGrade grade={link.score.grade} variant="solid" size={18} />{' '}
          {link.score.value} {' - '}
          {link.company}
        </CompanyLink>
      ))}
    </ChartContainer>
  );
}

export default LinksChart;
