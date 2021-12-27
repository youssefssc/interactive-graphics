import * as d3 from 'd3';
import {
  Paragraph,
  HexGrade,
  Text,
  Inline,
  Button,
} from '@securityscorecard/design-system';
import styled from 'styled-components';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

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
const ARC_EXPAND = 12;
const ANIMATION_TIME = 500;
const LEGEND_FONT_SIZE = 12;
const OPACITY_INACTIVE_ARC = 0.3;

const ChartContainer = styled.div`
  position: relative;
  // margin: 300px;
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
const processPieData = (raw, filters) => {
  const details1 = raw.details.filter((detail) => detail.proximity === 1)[0];
  const details2 = raw.details.filter((detail) => detail.proximity === 2)[0];

  const grades1 = Object.fromEntries(
    Object.entries(details1).filter(([key]) => key.length === 1),
  );
  const grades2 = Object.fromEntries(
    Object.entries(details2).filter(([key]) => key.length === 1),
  );
  const gradeFilter = filters.find(({ field }) => field === 'grade');

  const level1 = Object.values(grades1).map((risk) => {
    const { companies, score } = risk;
    return companies > 0
      ? {
          level: 1,
          grade: score.grade,
          value: companies,
          percent: Math.floor((100 * companies) / details1.summary.companies),
          selected: gradeFilter?.value?.includes(score.grade) || false,
        }
      : {};
  });

  const level2 = Object.values(grades2).map((risk) => {
    const { companies, score } = risk;
    return companies > 0
      ? {
          level: 2,
          grade: score.grade,
          value: companies,
          percent: Math.floor((100 * companies) / details2.summary.companies),
          selected: gradeFilter?.value?.includes(score.grade) || false,
        }
      : {};
  });
  console.log([[...level1], [...level2]]);
  return [[...level1], [...level2]];
};

function DoubleDonutChart({ width, height, data, filters, onSelectArc }) {
  const ref = useRef(null);
  const [selected, setSelected] = useState([]);
  const [hovered, setHovered] = useState({ grade: 'A', level: 0, value: 0 });
  const activeLevel = useMemo(
    () => filters.find(({ field }) => field === 'proximity').value,
    [filters],
  );

  const pieData = useMemo(() => processPieData(data, filters), [data, filters]);

  const dataLevel2 = useMemo(
    () => processPieData(data, filters).filter((entry) => entry.level === 2),
    [data, filters],
  );

  const radius = height / 2;

  const innerR1 = 0.55 * radius;
  const outerR1 = 0.7 * radius;

  const innerR2 = 0.85 * radius;
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
    arcGenerator(innerR1 - ARC_EXPAND, outerR1),
    arcGenerator(innerR2 - ARC_EXPAND, outerR2),
  ];

  const pieGenerator = d3
    .pie()
    .startAngle(START_ANGLE)
    .endAngle(END_ANGLE)
    .value((d) => d.value)
    .sort(null);

  const svg = d3.select(ref.current);
  // svg
  //   .attr('width', `${width}px`)
  //   .attr('height', `${height}px`)
  //   .attr('viewBox', [0, 0, width, height])
  //   .attr('preserveAspectRatio', 'xMinYMin');

  const draw = () => {
    // Donut
    const arcs1 = d3
      .select(ref.current)
      .select('g')
      .selectAll('path.level-1')
      .data(pieGenerator(pieData[0]));

    arcs1
      .enter()
      .append('path')
      .merge(arcs1)
      .attr('opacity', 0)
      .classed('is-arc-selected', (d) => d.data.selected)
      .classed('is-arc-not-selected', (d) => !d.data.selected)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      // .on('click', handleOnClickArc)
      .transition()
      .duration(ANIMATION_TIME)
      .attr('d', arcs[0])
      .attr('fill', (d) => colors[d.data.grade])
      .attr('opacity', activeLevel === 1 ? 1 : OPACITY_INACTIVE_ARC)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        console.log(d.data.selected);
        return function (t) {
          d.endAngle = i(t);
          return d.data.selected ? arcsActive[0](d) : arcs[0](d);
        };
      });

    //  arcs1 = svg.selectAll().data(pieGenerator(dataLevel1)).enter();

    d3.select(ref.current)
      .select('g')
      .selectAll()
      .data(pieGenerator(pieData[0]))
      .enter()
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

    // Donut level 2
    const arcs2 = d3
      .select(ref.current)
      .select('g')
      .selectAll('path.level-2')
      .data(pieGenerator(pieData[1]));

    arcs2
      .enter()
      .append('path')
      .merge(arcs2)
      .attr('opacity', 0)
      .classed('is-arc-selected', (d) => d.data.selected)
      .classed('is-arc-not-selected', (d) => !d.data.selected)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      // .on('click', handleOnClickArc)
      .transition()
      .duration(ANIMATION_TIME)
      .attr('d', arcs[1])
      .attr('fill', (d) => colors[d.data.grade])
      .attr('opacity', activeLevel === 2 ? 1 : OPACITY_INACTIVE_ARC)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        console.log(d.data.selected);
        return function (t) {
          d.endAngle = i(t);
          return d.data.selected ? arcsActive[1](d) : arcs[1](d);
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
        // console.log(tooltipX, ' + ', tooltipY);
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
      if (activeLevel === i.data.level) {
        d3.select(this).attr('d', arcsActive[i.data.level - 1]);
        const isArcSelected = selectedArcs.find(
          (arc) => arc.grade === i.data.grade && arc.level === i.data.level,
        );
        if (isArcSelected) {
          d3.select(this).attr('d', arcs[i.data.level - 1]);
          selectedArcs = selectedArcs.filter(
            (arc) => arc.grade !== i.data.grade || arc.level !== i.data.level,
          );
        } else {
          selectedArcs = [
            ...selectedArcs,
            { grade: i.data.grade, level: i.data.level },
          ];
        }
      }
      setSelected(selectedArcs);
      onSelectArc(selectedArcs);
    }

    // Labels;

    // arcs2
    //   .enter()
    //   .append('g')
    //   .attr('transform', (d) => `translate(${arcs[1].centroid(d)})`)
    //   .append('text')
    //   .text((d) => (d.data.percent > 5 ? d.data.percent + '%' : ''))
    //   .attr('y', LEGEND_FONT_SIZE / 2)
    //   .style('fill', '#fff')
    //   .style('text-anchor', 'middle')
    //   .style('font-size', 0)
    //   .transition()
    //   .duration(700)
    //   .style('font-size', `${LEGEND_FONT_SIZE}px`);
  };
  // , [data, height, activeLevel]);

  useEffect(() => {
    draw();
  }, [data, filters]);

  return (
    <>
      <Inline gap="lg">
        <Button
          variant="text"
          onClick={() => {
            setSelected([]);
            // setActiveLevel(1);
            onSelectArc([{ level: 1, grade: ' ALL' }]);
          }}
        >
          &nbsp; 3rd Party &nbsp;
        </Button>
        <Button
          variant="text"
          onClick={() => {
            setSelected([]);
            // setActiveLevel(2);
            onSelectArc([{ level: 2, grade: ' ALL' }]);
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
        <div>
          <svg ref={ref} width={width} height={height}>
            <g transform={`translate(${width / 2}, ${height / 2})`}>
              {pieData[0].map((d) => (
                <path key={d.grade} className={`grade-${d.grade} level-1`} />
              ))}
              {pieData[1].map((d) => (
                <path key={d.grade} className={`grade-${d.grade} level-2`} />
              ))}
            </g>
          </svg>
        </div>
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
