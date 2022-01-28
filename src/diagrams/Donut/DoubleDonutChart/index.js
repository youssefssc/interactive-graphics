import * as d3 from 'd3';
import {
  Paragraph,
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

import { isNotEmpty } from 'ramda-adjunct';

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
const ANIMATION_TIME = 1000;
const UPDATE_ANIMATION_TIME = 200;
const OPACITY_INACTIVE_ARC = 0.3;
const LEGEND_FONT_SIZE = 12;

const RADIUS = 285;

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
  height: 40px;
  padding: 12px;
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
  const proximity = filters.find(({ field }) => field === 'proximity')?.value;

  const level1 = Object.values(grades1).map((risk) => {
    const { companies, score } = risk;
    return companies > 0
      ? {
          level: 1,
          grade: score.grade,
          value: companies,
          percent: Math.floor((100 * companies) / details1.summary.companies),
          selected:
            proximity === 1 ? gradeFilter?.value?.includes(score.grade) : false,
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
          selected:
            proximity === 2 ? gradeFilter?.value?.includes(score.grade) : false,
        }
      : {};
  });
  return [[...level1], [...level2]];
};

function DoubleDonutChart({ width, height, data, filters, onSelectArc }) {
  const ref = useRef();
  const activeLevel = useMemo(
    () => filters.find(({ field }) => field === 'proximity').value,
    [filters],
  );

  const isAnimationDone = useRef(false);
  const [hoveredArc, setHoveredArc] = useState({});
  const [selected, setSelected] = useState([]);

  const pieData = useMemo(() => processPieData(data, filters), [data, filters]);

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

  const arcsBounce = [
    arcGenerator(innerR1 - 2 * ARC_EXPAND, outerR1),
    arcGenerator(innerR2 - 2 * ARC_EXPAND, outerR2),
  ];

  const pieGenerator = d3
    .pie()
    .startAngle(START_ANGLE)
    .endAngle(END_ANGLE)
    .value((d) => d.value)
    .sort(null);

  const draw = useCallback(() => {
    const tooltipDiv = d3.select('.tooltip-container');

    const arcsObject = [
      d3
        .select(ref.current)
        .select('g')
        .selectAll('path.level-1')
        .data(pieGenerator(pieData[0])),
      d3
        .select(ref.current)
        .select('g')
        .selectAll('path.level-2')
        .data(pieGenerator(pieData[1])),
    ];

    const addArcs = (level) => {
      arcsObject[level]
        .enter()
        .append('path')
        .merge(arcsObject[level])
        .attr('d', arcs[level])
        .attr('fill', (d) => colors[d.data.grade])
        .attr('opacity', activeLevel === level + 1 ? 1 : OPACITY_INACTIVE_ARC)
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleOnClickArc)
        .transition()
        .duration(
          isAnimationDone.current ? UPDATE_ANIMATION_TIME : ANIMATION_TIME,
        )
        .attrTween('d', function (d) {
          const i = d3.interpolate(d.startAngle, d.endAngle);
          return function (t) {
            if (!isAnimationDone.current) {
              d.endAngle = i(t);
            }
            return d.data.selected ? arcsActive[level](d) : arcs[level](d);
          };
        })
        .on('end', () => {
          if (level === 1) {
            isAnimationDone.current = true;
          }
        });
    };

    addArcs(0);
    addArcs(1);

    // Interaction Functions

    function handleMouseOver(d, i) {
      if (activeLevel === i.data.level && isAnimationDone.current) {
        const currentArcActive = arcsActive[activeLevel - 1];
        d3.select(this)
          .transition()
          .duration(UPDATE_ANIMATION_TIME)
          .attr('d', currentArcActive)
          .attr('opacity', 1);

        setHoveredArc({
          grade: i.data.grade,
          level: i.data.level,
          value: i.data.value,
        });

        const [x, y] = currentArcActive.centroid(i);

        const tooltipX = x + width / 2 + 1.5 * LEGEND_FONT_SIZE;
        const tooltipY = y + height / 2 - 3 * LEGEND_FONT_SIZE;
        tooltipDiv.style('left', `${tooltipX}px`).style('top', `${tooltipY}px`);
        tooltipDiv
          .transition()
          .duration(UPDATE_ANIMATION_TIME)
          .style('opacity', 1);
      }
    }

    function handleMouseOut(d, i) {
      if (activeLevel === i.data.level && isAnimationDone.current) {
        const oldGrades = pieData[activeLevel - 1]
          .filter(({ selected }) => selected)
          .map(({ grade }) => grade);
        const isArcSelected = oldGrades.includes(i.data.grade);

        if (!isArcSelected) {
          d3.select(this)
            .transition()
            .duration(UPDATE_ANIMATION_TIME)
            .attr('d', arcs[activeLevel - 1]);
        }
        tooltipDiv.transition().duration(100).style('opacity', 0);
      }
    }

    function handleOnClickArc(d, i) {
      if (activeLevel === i.data.level && isAnimationDone.current) {
        const oldGrades = pieData[activeLevel - 1]
          .filter(({ selected }) => selected)
          .map(({ grade }) => grade);
        const isArcSelected = oldGrades.includes(i.data.grade);
        d3.select(this)
          .transition()
          .duration(UPDATE_ANIMATION_TIME / 2)
          .attr('d', arcsBounce[activeLevel - 1])
          .transition()
          .duration(UPDATE_ANIMATION_TIME / 2)
          .attr(
            'd',
            isArcSelected ? arcs[activeLevel - 1] : arcsActive[activeLevel - 1],
          );

        // if arc is selected remove it, otherwise add it
        const newGrades = isArcSelected
          ? oldGrades.filter((grade) => grade !== i.data.grade)
          : [...oldGrades, i.data.grade];

        setTimeout(() => {
          onSelectArc({
            proximity: activeLevel,
            grades: isNotEmpty(newGrades) ? newGrades : null,
          });
        }, UPDATE_ANIMATION_TIME);
      }
    }

    // Labels
    const addLabels = (level) => {
      d3.select(ref.current)
        .select('g')
        .selectAll()
        .data(pieGenerator(pieData[level]))
        .enter()
        .append('g')
        .attr('transform', (d) => `translate(${arcs[level].centroid(d)})`)
        .append('text')
        .text((d) => (d.data.percent > 5 ? `${d.data.percent}%` : ''))
        .attr('y', LEGEND_FONT_SIZE / 2)
        .attr('pointer-events', 'none')
        .style('fill', '#fff')
        .style('text-anchor', 'middle')
        .style(
          'font-size',
          isAnimationDone.current ? `${LEGEND_FONT_SIZE}px` : 0,
        )
        .transition()
        .duration(UPDATE_ANIMATION_TIME)
        .style('font-size', `${LEGEND_FONT_SIZE}px`);
    };

    d3.select(ref.current).select('g').selectAll('g').remove();
    addLabels(0);
    addLabels(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieData, activeLevel]);

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, filters]);

  return (
    <>
      <Inline gap="lg">
        <Button
          variant="text"
          onClick={() => {
            setSelected([]);
            onSelectArc([{ proximity: 1, grades: [] }]);
          }}
        >
          &nbsp; 3rd Party &nbsp;
        </Button>
        <Button
          variant="text"
          onClick={() => {
            setSelected([]);
            onSelectArc([{ proximity: 2, grades: [] }]);
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
              <Paragraph size="md" isBold margin={{ vertical: 0.5 }}>
                <Text isBold> {hoveredArc.value} Connections </Text>
              </Paragraph>
            </>
          </TooltipPopup>
        </TooltipContainer>
      </ChartContainer>
    </>
  );
}

export default DoubleDonutChart;
