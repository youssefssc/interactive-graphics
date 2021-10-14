import React, { useEffect, useState } from 'react';
import { mockData } from './mockData';
import ContourChart from './ContourChart';

function Contour() {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(mockData);
    }, []);

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //min and max are inclusive 
    }

    const changeData = () => {
        const newData = mockData.map(({x,y})=>{
            return( {x:x + getRandomInt(-4,4), y: y + getRandomInt(-1,1)});
            }
        );
        setData(newData);
    }


    return (
        <div className='diagram-container'>
            <h2>Contour D3 </h2>
            <p> Data and D3 graph are seperate from<a href="https://observablehq.com/@d3/density-contours"><u>this observable HQ example</u></a> </p>
            <button onClick={changeData}>Change Data</button>
            <br />
            <ContourChart width={900} height={450} dataProp={data} />
        </div>
    );
}

export default Contour;