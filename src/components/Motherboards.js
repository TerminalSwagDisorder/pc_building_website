import React from "react";

const BasicRenderMotherboards = ({ motherboards }) => {
	return (
		<div>
			<h1>Computer Motherboards</h1>
			<ul>
			{motherboards.map((motherboardItem) => (
				<li key={motherboardItem.ID} className="componentListItem">
					<div>Manufacturer: {motherboardItem.Manufacturer}</div>
					<div>Name: {motherboardItem.Name}</div>
					<div>Price: {motherboardItem.Price}</div>
					<img src={`/product_images/${motherboardItem.Image}`} alt={motherboardItem.Name} height="400"/>
				</li>
			))}
			</ul>
		</div>
	);
};

export default BasicRenderMotherboards;
