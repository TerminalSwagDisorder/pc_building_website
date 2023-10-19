import React from "react";

const BasicRenderStorages = ({ storages }) => {
	return (
		<div>
			<h1>Computer Storages</h1>
			<ul>
			{storages.map((storageItem) => (
				<li key={storageItem.ID} className="componentListItem">
					<div>Manufacturer: {storageItem.Manufacturer}</div>
					<div>Name: {storageItem.Name}</div>
					<div>Price: {storageItem.Price}</div>
					<img src={`/product_images/${storageItem.Image}`} alt={storageItem.Name} height="400"/>
				</li>
			))}
			</ul>
		</div>
	);
};

export default BasicRenderStorages;
