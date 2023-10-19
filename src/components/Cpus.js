import React from "react";

const BasicRenderCpus = ({ cpus }) => {
	return (
		<div>
			<h1>Computer Cpus</h1>
			<ul>
			{cpus.map((cpuItem) => (
				<li key={cpuItem.ID} className="componentListItem">
					<div>Manufacturer: {cpuItem.Manufacturer}</div>
					<div>Name: {cpuItem.Name}</div>
					<div>Price: {cpuItem.Price}</div>
					<img src={`/product_images/${cpuItem.Image}`} alt={cpuItem.Name} height="400"/>
				</li>
			))}
			</ul>
		</div>
	);
};

export default BasicRenderCpus;
