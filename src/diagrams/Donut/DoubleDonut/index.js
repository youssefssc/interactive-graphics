import React, { useEffect, useState } from 'react';
import DoubleDonutChart from '../DoubleDonutChart';

const riskData = {
  summary: {
    companies: 21,
    score: {
      grade: 'B',
      value: 81,
    },
  },
  details: [
    {
      proximity: 1,
      summary: {
        companies: 8,
        score: {
          grade: 'B',
          value: 81,
        },
      },
      a: {
        companies: 1,
        score: {
          grade: 'A',
          value: 90,
        },
      },
      b: {
        companies: 3,
        score: {
          grade: 'B',
          value: 84,
        },
      },
      c: {
        companies: 2,
        score: {
          grade: 'C',
          value: 79,
        },
      },
      d: {
        companies: 1,
        score: {
          grade: 'D',
          value: 65,
        },
      },
      f: {
        companies: 1,
        score: {
          grade: 'F',
          value: 50,
        },
      },
    },
    {
      proximity: 2,
      summary: {
        companies: 14,
        score: {
          grade: 'B',
          value: 83,
        },
      },
      a: {
        companies: 5,
        score: {
          grade: 'A',
          value: 95,
        },
      },
      b: {
        companies: 4,
        score: {
          grade: 'B',
          value: 85,
        },
      },
      c: {
        companies: 3,
        score: {
          grade: 'C',
          value: 75,
        },
      },
      d: {
        companies: 2,
        score: {
          grade: 'D',
          value: 65,
        },
      },
      f: {
        companies: 0,
      },
    },
  ],
};

const datas = [
  [
    { level: 1, grade: 'A', value: 5, percent: 10 },
    { level: 1, grade: 'B', value: 9, percent: 20 },
    { level: 1, grade: 'C', value: 3, percent: 7 },
    { level: 1, grade: 'D', value: 4, percent: 8 },
    { level: 1, grade: 'F', value: 2, percent: 6 },
    { level: 2, grade: 'A', value: 20, percent: 2 },
    { level: 2, grade: 'B', value: 139, percent: 21 },
    { level: 2, grade: 'C', value: 133, percent: 20 },
    { level: 2, grade: 'D', value: 124, percent: 18 },
    { level: 2, grade: 'F', value: 170, percent: 24 },
  ],
  [
    { level: 1, grade: 'A', value: 15, percent: 40 },
    { level: 1, grade: 'B', value: 9, percent: 24 },
    { level: 1, grade: 'C', value: 3, percent: 8 },
    { level: 1, grade: 'D', value: 4, percent: 12 },
    { level: 1, grade: 'F', value: 2, percent: 6 },
    { level: 2, grade: 'A', value: 250, percent: 39 },
    { level: 2, grade: 'B', value: 139, percent: 23 },
    { level: 2, grade: 'C', value: 133, percent: 21 },
    { level: 2, grade: 'D', value: 124, percent: 20 },
    { level: 2, grade: 'F', value: 170, percent: 10 },
  ],
];

const riskFilters = [
  [
    {
      field: 'grade',
      value: ['A', 'B'],
    },
    {
      field: 'proximity',
      value: 1,
    },
  ],
  [
    {
      field: 'grade',
      value: ['A'],
    },
    {
      field: 'proximity',
      value: 1,
    },
  ],
  [
    {
      field: 'grade',
      value: ['A'],
    },
    {
      field: 'proximity',
      value: 2,
    },
  ],
  [
    {
      field: 'grade',
      value: ['C'],
    },
    {
      field: 'proximity',
      value: 1,
    },
  ],
];

var i = 0;

function DoubleDonut() {
  // const [data, setData] = useState(datas[0]);
  const [filters, setFilters] = useState(riskFilters[0]);

  useEffect(() => {
    changeData();
  }, []);

  const changeData = () => {
    // setData(datas[i++]);
    // if (i === datas.length) i = 0;
    setFilters(riskFilters[i++]);
    if (i === riskFilters.length) i = 0;
  };

  const handleSelectArc = (selected) => {
    console.log(
      'Filtering :',
      selected.map((arc) => arc.level + arc.grade + ' '),
    );
  };

  return (
    <div className="diagram-container">
      <h3>Double Donut with D3 </h3>
      <button onClick={changeData}>Change Filters</button>
      <DoubleDonutChart
        width={600}
        height={600}
        data={riskData}
        filters={filters}
        onSelectArc={handleSelectArc}
      />
    </div>
  );
}

export default DoubleDonut;
