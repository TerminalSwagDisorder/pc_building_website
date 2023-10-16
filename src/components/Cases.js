import React from "react";

const BasicRenderCases = ({ cases }) => {
	console.log('Cases in BasicRenderCases:', cases);
	return (
		<div>
			<h1>Computer Cases</h1>
			<ul>
			{cases.map((caseItem) => (
				<li key={caseItem.ID} style={{ marginBottom: "4em" }}>
					<div>Manufacturer: {caseItem.Manufacturer}</div>
					<div>Name: {caseItem.Name}</div>
					<div>Price: {caseItem.Price}</div>
					<img src={`/product_images/${caseItem.Image}`} alt={caseItem.Name} height="400"/>
				</li>
			))}
			</ul>
		</div>
	);
};

export default BasicRenderCases;
