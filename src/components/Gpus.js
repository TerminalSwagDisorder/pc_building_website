import React from "react";

const BasicRenderGpus = ({ gpus }) => {
	return (
		<div>
			<h1>Computer Gpus</h1>
			<ul>
			{gpus.map((gpuItem) => (
				<li key={gpuItem.ID} className="componentListItem">
					<div>Manufacturer: {gpuItem.Manufacturer}</div>
					<div>Name: {gpuItem.Name}</div>
					<div>Price: {gpuItem.Price}</div>
					<img src={`/product_images/${gpuItem.Image}`} alt={gpuItem.Name} height="400"/>
				</li>
			))}
			</ul>
		</div>
	);
};

export default BasicRenderGpus;
