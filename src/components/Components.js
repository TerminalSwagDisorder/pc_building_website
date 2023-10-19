import React, { useState } from "react";
import '../style/style.scss';
import Grid from "@mui/material/Grid";

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
			<div style={{ maxWidth: "1000px", margin: "0 auto" }}>
				<h1>All Components</h1>
				<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
				<Grid container spacing={2} sx={{ justifyContent: "center" }}>
					<Grid item xs={12} sm={6} md={3}>
						<h2 className="componentsh2" onClick={() => setShowCases(!showCases)}>Cases{showCases ? <span className="arrow">▲</span> : <span className="arrow">▼</span>}</h2>
						{showCases && (
							<div className="component-list">
								<ul>
									{cases.map((caseItem) => (
										<li key={caseItem.ID}>{caseItem.Manufacturer} - {caseItem.Name}</li>
									))}
								</ul>
							</div>
						)}
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<h2 className="componentsh2" onClick={() => setShowCpus(!showCpus)}>CPUs{showCpus ? <span className="arrow">▲</span> : <span className="arrow">▼</span>}</h2>
						{showCpus && (
							<div className="component-list">
								<ul>
									{cpus.map((cpuItem) => (
										<li key={cpuItem.ID}>{cpuItem.Manufacturer} - {cpuItem.Name}</li>
									))}
								</ul>
							</div>
						)}
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<h2 className="componentsh2" onClick={() => setShowCpuCoolers(!showCpuCoolers)}>CPU Coolers{showCpuCoolers ? <span className="arrow">▲</span> : <span className="arrow">▼</span>}</h2>
						{showCpuCoolers && (
							<div className="component-list">
								<ul>
									{cpuCoolers.map((cpuCoolerItem) => (
										<li key={cpuCoolerItem.ID}>{cpuCoolerItem.Manufacturer} - {cpuCoolerItem.Name}</li>
									))}
								</ul>
							</div>
						)}
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<h2 className="componentsh2" onClick={() => setShowGpus(!showGpus)}>GPUs{showGpus ? <span className="arrow">▲</span> : <span className="arrow">▼</span>}</h2>
						{showGpus && (
							<div className="component-list">
								<ul>
									{gpus.map((gpuItem) => (
										<li key={gpuItem.ID}>{gpuItem.Manufacturer} - {gpuItem.Name}</li>
									))}
								</ul>
							</div>
						)}
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<h2 className="componentsh2" onClick={() => setShowMemories(!showMemories)}>Memories{showMemories ? <span className="arrow">▲</span> : <span className="arrow">▼</span>}</h2>
						{showMemories && (
							<div className="component-list">
								<ul>
									{memories.map((memorieItem) => (
										<li key={memorieItem.ID}>{memorieItem.Manufacturer} - {memorieItem.Name}</li>
									))}
								</ul>
							</div>
						)}
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<h2 className="componentsh2" onClick={() => setShowMotherboards(!showMotherboards)}>Motherboards{showMotherboards ? <span className="arrow">▲</span> : <span className="arrow">▼</span>}</h2>
						{showMotherboards && (
							<div className="component-list">
								<ul>
									{motherboards.map((motherboardItem) => (
										<li key={motherboardItem.ID}>{motherboardItem.Manufacturer} - {motherboardItem.Name}</li>
									))}
								</ul>
							</div>
						)}
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<h2 className="componentsh2" onClick={() => setShowPsus(!showPsus)}>PSUs{showPsus ? <span className="arrow">▲</span> : <span className="arrow">▼</span>}</h2>
						{showPsus && (
							<div className="component-list">
								<ul>
									{psus.map((psuItem) => (
										<li key={psuItem.ID}>{psuItem.Manufacturer} - {psuItem.Name}</li>
									))}
								</ul>
							</div>
						)}
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<h2 className="componentsh2" onClick={() => setShowStorages(!showStorages)}>Storages{showStorages ? <span className="arrow">▲</span> : <span className="arrow">▼</span>}</h2>
						{showStorages && (
							<div className="component-list">
								<ul>
									{storages.map((storageItem) => (
										<li key={storageItem.ID}>{storageItem.Manufacturer} - {storageItem.Name}</li>
									))}
								</ul>
							</div>
						)}
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default BasicRenderComponents;