import React, { useState, useEffect } from 'react';
import { fetchCpuData } from '../api';

const Cpu1 = () => {
    const [cpus, setCpus] = useState([]);

    useEffect(() => {
        fetchCpuData()
            .then(data => setCpus(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>CPU Data</h1>
            <ul>
                {cpus.map(cpu => (
                    <li key={cpu.ID}>
                        <h2>Image</h2>
                        <h2>{cpu.Name}</h2>
                        <p>Manufacturer: {cpu.Manufacturer}</p>
                        <p>Core Count: {cpu["Core Count"]}</p>
                        <p>Thread Count: {cpu["Thread Count"]}</p>
                        <p>Base Clock: {cpu["Base Clock"]}</p>
                        <p>Cache: {cpu.Cache}</p>
                        <p>Socket: {cpu.Socket}</p>
                        <p>TDP: {cpu.TDP}</p>
                        <p>Integrated GPU: {cpu["Integrated GPU"] || 'N/A'}</p>
                        <p>Price: {cpu.Price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Cpu1;
