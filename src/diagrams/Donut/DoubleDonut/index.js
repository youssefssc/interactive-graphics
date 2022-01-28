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
  const [filters, setFilters] = useState(riskFilters[0]);

  useEffect(() => {
    changeData();
  }, []);

  const changeData = () => {
    setFilters(riskFilters[i++]);
    if (i === riskFilters.length) i = 0;
  };

  const handleSelectArc = ({ proximity, grades }) => {
    setFilters([
      { field: 'proximity', value: proximity },
      { field: 'grade', value: grades ?? null },
    ]);
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
