import React from "react";

const BasicRenderMemories = ({ memories }) => {
	return (
		<div>
			<h1>Computer Memories</h1>
			<ul>
			{memories.map((memoryItem) => (
				<li key={memoryItem.ID} className="componentListItem">
					<div>Manufacturer: {memoryItem.Manufacturer}</div>
					<div>Name: {memoryItem.Name}</div>
					<div>Price: {memoryItem.Price}</div>
					<img src={`/product_images/${memoryItem.Image}`} alt={memoryItem.Name} height="400"/>
				</li>
			))}
			</ul>
		</div>
	);
};

export default BasicRenderMemories;
