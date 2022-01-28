import React, { useRef, useEffect, useCallback, useMemo } from 'react';
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
  return heights.flatMap((y) => [
    {
      source: [0, height / 2],
      target: [width / 3, y],
    },
    {
      source: [(2 * width) / 3, y],
      target: [width, height / 2],
    },
  ]);
};

function LinksChart({ width, height, data }) {
  const ref = useRef();
  const heights = useMemo(() => calcHeights(data, height), [data, height]);

  const linkGenerator = d3
    .linkHorizontal()
    .source((d) => [d.source[0], d.source[1]])
    .target((d) => [d.target[0], d.target[1]]);

  const draw = useCallback(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('path').remove();

    const linksData = prepData(heights, height, width);

    // Add the link paths
    const links = svg.selectAll().data(linksData);
    links
      .enter()
      .append('path')
      .merge(links)
      .attr('d', linkGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#D1D1D1')
      .attr('stroke-width', 0.8)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);
  }, [height, heights, linkGenerator, width]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.attr('width', width).attr('height', height);
  }, [width, height]);

  useEffect(() => {
    draw();
  }, [data, height, draw]);

  return (
    <ChartContainer>
      <svg ref={ref} width={width} height={height}></svg>
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
