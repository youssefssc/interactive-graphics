import React, { useEffect, useState } from 'react';
import DoubleDonutChart from '../DoubleDonutChart';

const datas = [
  [
    { level: 1, grade: 'A', value: 5 },
    { level: 1, grade: 'B', value: 9 },
    { level: 1, grade: 'C', value: 3 },
    { level: 1, grade: 'D', value: 4 },
    { level: 1, grade: 'F', value: 2 },
    { level: 2, grade: 'A', value: 90 },
    { level: 2, grade: 'B', value: 139 },
    { level: 2, grade: 'C', value: 133 },
    { level: 2, grade: 'D', value: 124 },
    { level: 2, grade: 'F', value: 170 },
  ],
  [
    { level: 1, grade: 'A', value: 15 },
    { level: 1, grade: 'B', value: 9 },
    { level: 1, grade: 'C', value: 3 },
    { level: 1, grade: 'D', value: 4 },
    { level: 1, grade: 'F', value: 2 },
    { level: 2, grade: 'A', value: 250 },
    { level: 2, grade: 'B', value: 139 },
    { level: 2, grade: 'C', value: 133 },
    { level: 2, grade: 'D', value: 124 },
    { level: 2, grade: 'F', value: 170 },
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

  return (
    <div className="diagram-container">
      <h3>Double Donut with D3 </h3>
      <button onClick={changeData}>Change Data</button>
      <DoubleDonutChart width={400} height={400} data={data} />
    </div>
  );
}

export default DoubleDonut;
