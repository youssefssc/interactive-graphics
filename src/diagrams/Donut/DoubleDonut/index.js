import React, { useEffect, useState } from 'react';
import DoubleDonutChart from '../DoubleDonutChart';

// const sameAsVendors = {};
// const risks = {
//   vendors: {
//     summary: { companies: 220, grade: 'B', score: 81 },
//     details: [
//       {
//         proximity: 1,
//         summary: { companies: 20, grade: 'B', score: 81 },
//         A: { score: 81, companies: 4 },
//         B: { score: 81, companies: 4 },
//         C: { score: 81, companies: 4 },
//         D: { score: 81, companies: 4 },
//         F: { score: 81, companies: 4 },
//       },
//       {
//         proximity: 1,
//         summary: { companies: 200, grade: 'B', score: 81 },
//         A: { score: 81, companies: 4 },
//         B: { score: 81, companies: 4 },
//         C: { score: 81, companies: 4 },
//         D: { score: 81, companies: 4 },
//         F: { score: 81, companies: 4 },
//       },
//     ],
//   },
//   consumers: { ...sameAsVendors },
// };

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

var i = 0;

function DoubleDonut() {
  const [data, setData] = useState([]);

  useEffect(() => {
    changeData();
  }, []);

  const changeData = () => {
    setData(datas[i++]);
    if (i === datas.length) i = 0;
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
      <button onClick={changeData}>Change Data</button>
      <DoubleDonutChart
        width={600}
        height={600}
        data={data}
        onSelectArc={handleSelectArc}
      />
    </div>
  );
}

export default DoubleDonut;
