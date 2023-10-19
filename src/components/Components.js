import React, { useState } from "react";
import './styling.scss';

const BasicRenderComponents = ({ cases, cpus, cpuCoolers, gpus, memories, motherboards, psus, storages, currentUser }) => {
	const [showCases, setShowCases] = useState(false);
	const [showCpus, setShowCpus] = useState(false);
	const [showCpuCoolers, setShowCpuCoolers] = useState(false);
	const [showGpus, setShowGpus] = useState(false);
	const [showMemories, setShowMemories] = useState(false);
	const [showMotherboards, setShowMotherboards] = useState(false);
	const [showPsus, setShowPsus] = useState(false);
	const [showStorages, setShowStorages] = useState(false);

	return (
		<div>
			<h1>All Components</h1>
			
			<h2 className="componentsh2" onClick={() => setShowCases(!showCases)}>Cases</h2>
			{showCases && (
				<ul>
					{cases.map((caseItem) => (
						<li key={caseItem.ID}>{caseItem.Manufacturer} - {caseItem.Name}</li>
					))}
				</ul>
			)}
			
			<h2 className="componentsh2" onClick={() => setShowCpus(!showCpus)}>CPUs</h2>
			{showCpus && (
				<ul>
					{cpus.map((cpuItem) => (
						<li key={cpuItem.ID}>{cpuItem.Manufacturer} - {cpuItem.Name}</li>
					))}
				</ul>
			)}

			<h2 className="componentsh2" onClick={() => setShowCpuCoolers(!showCpuCoolers)}>CPU Coolers</h2>
			{showCpuCoolers && (
				<ul>
					{cpuCoolers.map((cpuCoolerItem) => (
						<li key={cpuCoolerItem.ID}>{cpuCoolerItem.Manufacturer} - {cpuCoolerItem.Name}</li>
					))}
				</ul>
			)}

			<h2 className="componentsh2" onClick={() => setShowGpus(!showGpus)}>GPUs</h2>
			{showGpus && (
				<ul>
					{gpus.map((gpuItem) => (
						<li key={gpuItem.ID}>{gpuItem.Manufacturer} - {gpuItem.Name}</li>
					))}
				</ul>
			)}

			<h2 className="componentsh2" onClick={() => setShowMemories(!showMemories)}>Memories</h2>
			{showMemories && (
				<ul>
					{memories.map((memoryItem) => (
						<li key={memoryItem.ID}>{memoryItem.Manufacturer} - {memoryItem.Name}</li>
					))}
				</ul>
			)}

			<h2 className="componentsh2" onClick={() => setShowMotherboards(!showMotherboards)}>Motherboards</h2>
			{showMotherboards && (
				<ul>
					{motherboards.map((motherboardItem) => (
						<li key={motherboardItem.ID}>{motherboardItem.Manufacturer} - {motherboardItem.Name}</li>
					))}
				</ul>
			)}

			<h2 className="componentsh2" onClick={() => setShowPsus(!showPsus)}>PSUs</h2>
			{showPsus && (
				<ul>
					{psus.map((psuItem) => (
						<li key={psuItem.ID}>{psuItem.Manufacturer} - {psuItem.Name}</li>
					))}
				</ul>
			)}

			<h2 className="componentsh2" onClick={() => setShowStorages(!showStorages)}>Storages</h2>
			{showStorages && (
				<ul>
					{storages.map((storageItem) => (
						<li key={storageItem.ID}>{storageItem.Manufacturer} - {storageItem.Name}</li>
					))}
				</ul>
			)}

		</div>
	);
};

export default BasicRenderComponents;
