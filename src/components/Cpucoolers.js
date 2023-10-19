import React from "react";

const BasicRenderCpuCoolers = ({ cpuCoolers }) => {
	return (
		<div>
			<h1>Computer Cpu coolers</h1>
			<ul>
			{cpuCoolers.map((cpuCoolerItem) => (
				<li key={cpuCoolerItem.ID} className="componentListItem">
					<div>Manufacturer: {cpuCoolerItem.Manufacturer}</div>
					<div>Name: {cpuCoolerItem.Name}</div>
					<div>Price: {cpuCoolerItem.Price}</div>
					<img src={`/product_images/${cpuCoolerItem.Image}`} alt={cpuCoolerItem.Name} height="400"/>
				</li>
			))}
			</ul>
		</div>
	);
};

export default BasicRenderCpuCoolers;
