import React, { useEffect, useState } from 'react';
import DonutChart from './DonutChart';

const datas = [
  [
    { name: 'A', value: 5 },
    { name: 'B', value: 9 },
    { name: 'C', value: 3 },
    { name: 'D', value: 4 },
    { name: 'F', value: 2 },
  ],
  [
    { name: 'A', value: 150 },
    { name: 'B', value: 139 },
    { name: 'C', value: 133 },
    { name: 'D', value: 124 },
    { name: 'F', value: 170 },
  ],
];

var i = 0;

function Donut() {
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
      <h3>Half Donut with D3 </h3>
      <button onClick={changeData}>Change Data</button>
      <DonutChart width={400} height={400} data={data} />
    </div>
  );
}

export default Donut;
