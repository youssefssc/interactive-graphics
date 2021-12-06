import React, { useEffect, useState } from 'react';
import LinksChart from './LinksChart';

const datas = [
  [
    { company: 'Company 1', score: { grade: 'A', value: 90 } },
    { company: 'Company 2', score: { grade: 'B', value: 80 } },
    { company: 'Company 3', score: { grade: 'C', value: 70 } },
    { company: 'Company 4', score: { grade: 'B', value: 81 } },
    { company: 'Company 5', score: { grade: 'A', value: 91 } },
  ],
  [
    { company: 'Company 1', score: { grade: 'A', value: 90 } },
    { company: 'Company 2', score: { grade: 'B', value: 80 } },
    { company: 'Company 3', score: { grade: 'C', value: 70 } },
    { company: 'Company 4', score: { grade: 'B', value: 81 } },
    { company: 'Company 5', score: { grade: 'A', value: 91 } },
    { company: 'Company 6', score: { grade: 'A', value: 90 } },
    { company: 'Company 7', score: { grade: 'B', value: 80 } },
    { company: 'Company 8', score: { grade: 'C', value: 70 } },
    { company: 'Company 9', score: { grade: 'B', value: 81 } },
    { company: 'Company 10', score: { grade: 'B', value: 81 } },
    { company: 'Company 11', score: { grade: 'A', value: 91 } },
    { company: 'Company 12', score: { grade: 'C', value: 70 } },
    { company: 'Company 13', score: { grade: 'B', value: 81 } },
    { company: 'Company 14', score: { grade: 'A', value: 91 } },
    { company: 'Company 15', score: { grade: 'C', value: 70 } },
    { company: 'Company 16', score: { grade: 'B', value: 81 } },
    { company: 'Company 17', score: { grade: 'A', value: 91 } },
    { company: 'Company 18', score: { grade: 'C', value: 70 } },
    { company: 'Company 19', score: { grade: 'B', value: 81 } },
    { company: 'Company 20', score: { grade: 'A', value: 91 } },
    { company: 'Company 21', score: { grade: 'B', value: 81 } },
    { company: 'Company 22', score: { grade: 'A', value: 91 } },
    { company: 'Company 23', score: { grade: 'C', value: 70 } },
    { company: 'Company 24', score: { grade: 'B', value: 81 } },
    { company: 'Company 25', score: { grade: 'A', value: 91 } },
  ],
  [
    { company: 'Company 1', score: { grade: 'B', value: 81 } },
    { company: 'Company 2', score: { grade: 'A', value: 91 } },
  ],
];

var i = 0;

function Links() {
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
      <h3>Links with D3 + React Components Labels</h3>
      <button onClick={changeData}>Change Data</button>
      <LinksChart width={800} height={800} data={data} />
    </div>
  );
}

export default Links;
