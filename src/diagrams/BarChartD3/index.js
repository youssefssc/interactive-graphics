import React, { useEffect, useState } from 'react';
import BarChart from './BarChart';

const datas = [
    [10, 30, 40, 20],
    [10, 40, 30, 20, 50, 10],
    [60, 30, 40, 20, 30]
]
var i = 0;

function BarChartD3() {
    const [data, setData] = useState([]);

    useEffect(() => {
        changeData();
    }, []);

    const changeData = () => {
        setData(datas[i++]);
        if(i === datas.length) i = 0;
    }


    return (
        <div className='diagram-container'>
            <h2>BarChart D3 integration example</h2>
            <p> Data and D3 graph are seperate and using React Hooks </p>
            <button onClick={changeData}>Change Data</button>
            <BarChart width={600} height={400} data={data} />
        </div>
    );
}

export default BarChartD3;