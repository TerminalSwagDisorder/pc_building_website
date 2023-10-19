import React from "react";

const BasicRenderPsus = ({ psus }) => {
	return (
		<div>
			<h1>Computer Psus</h1>
			<ul>
			{psus.map((psuItem) => (
				<li key={psuItem.ID} className="componentListItem">
					<div>Manufacturer: {psuItem.Manufacturer}</div>
					<div>Name: {psuItem.Name}</div>
					<div>Price: {psuItem.Price}</div>
					<img src={`/product_images/${psuItem.Image}`} alt={psuItem.Name} height="400"/>
				</li>
			))}
			</ul>
		</div>
	);
};

export default BasicRenderPsus;
