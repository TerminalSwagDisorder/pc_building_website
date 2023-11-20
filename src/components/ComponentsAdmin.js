import React, { useState, useEffect } from "react";
import { checkIfSignedIn } from "../api";
import { Input } from '@mui/material';
import Button from '@mui/material/Button';


const ComponentsAdmin = ({ currentUser, handleAddComponentsAdmin, cases, cpus, cpuCoolers, gpus, memories, motherboards, psus, storages }) => {
	const [currentComponent, setCurrentComponent] = useState("");
	const [currentComponentData, setCurrentComponentData] = useState(null);
	const [inputValue, setInputValue] = useState("");
	const [formFields, setFormFields] = useState({});


    const handleNewComponent = (componentType) => {
        setCurrentComponent(componentType);
		if (componentType === "chassis" && cases.length > 0) {
			setCurrentComponentData(cases[0]);	
		}
		if (componentType === "cpu" && cpus.length > 0) {
			setCurrentComponentData(cpus[0]);	
		}
		if (componentType === "cpu_cooler" && cpuCoolers.length > 0) {
			setCurrentComponentData(cpuCoolers[0]);	
		}
		if (componentType === "gpu" && gpus.length > 0) {
			setCurrentComponentData(gpus[0]);	
		}
		if (componentType === "memory" && memories.length > 0) {
			setCurrentComponentData(memories[0]);	
		}
		if (componentType === "motherboard" && motherboards.length > 0) {
			setCurrentComponentData(motherboards[0]);	
		}
		if (componentType === "psu" && psus.length > 0) {
			setCurrentComponentData(psus[0]);	
		}
		if (componentType === "storage" && storages.length > 0) {
			setCurrentComponentData(storages[0]);	
		}
		
    };

	const closeForm = (componentType) => {
		setCurrentComponent(null)
	}

    const handleInputChange = (event) => {
		setInputValue(event.target.value);
		console.log(event.target.name, event.target.value)
		setFormFields(prevFields => ({
			...prevFields,
			[event.target.name]: event.target.value
		}));
	};

/*
const componentConfigs = {
	"chassis" : [
		{ label: "Chassis_type", name: "chassis_type", type: "text" },
		{ label: "Dimensions", name: "dimensions", type: "text" },
		{ label: "Color", name: "color", type: "text" },
		{ label: "Compatibility", name: "compatibility", type: "text" },
				],
	"cpu" : [
		{ label: "Core_Count", name: "core_count", type: "text" },
		{ label: "Thread_Count", name: "thread_count", type: "text" },
		{ label: "Base_Clock", name: "base_clock", type: "text" },
		{ label: "Cache", name: "cache", type: "text" },
		{ label: "Socket", name: "socket", type: "text" },
		{ label: "Cpu_cooler", name: "cpu_cooler", type: "text" },
		{ label: "TDP", name: "tdp", type: "text" },
		{ label: "Integrated_GPU", name: "integrated_gpu", type: "text" },
		
	],
	"cpu_cooler" : [
		{ label: "Compatibility", name: "compatibility", type: "text" },
		{ label: "Cooling_Potential", name: "cooling_potential", type: "text" },
		{ label: "Fan_RPM", name: "fan_rpm", type: "text" },
		{ label: "Noise_Level", name: "fan_rpm", type: "text" },
		
	],
	"gpu" : [
		
	],	
	"memory" : [
		
	],
	"motherboard" : [
		
	],
	"psu" : [
		
	],
	"storage" : [
		
	]
}
*/


	// For dynamically rendering a form for each component type 
	const renderDynamicFormFields = () => {
		if (!currentComponentData) return null;
		const excludeKeys = ["ID", "Image_Url"];
		const requiredKeys = ["Url", "Price", "Name", "Manufacturer"];
		const imageKeys = ["Image"]
		const numberKeys = ["Price"]

		return Object.keys(currentComponentData).map((key) => {
			if (excludeKeys.includes(key)) return null;
			
			const isRequired = requiredKeys.includes(key)
			const isImage = imageKeys.includes(key)
			const isNumber = numberKeys.includes(key)
			
			let inputType;
			
			if (isImage) {
				inputType = (
					<Input type="file" name={key} onChange={handleInputChange} />
				);
			} else if (isNumber) {
				inputType = (
					<input required={isRequired} type="number" name={key} placeholder={key} onChange={handleInputChange} step="0.01" style={{backgroundColor: "gray"}}/>
				);
			} else {
				inputType = (
					<Input required={isRequired} type="text" name={key} placeholder={key} onChange={handleInputChange} />
				);
			}

			return (
				<div key={key}>
					<label>{isRequired && "* "}</label>
						{inputType}
					<br /><br />
				</div>
			);
		});
	};


	/*
	// Works, but ugly
    const renderDynamicFormFields = () => {
        if (!currentComponentData) return null;
		const excludeKeys = ["ID", "Image_Url", "Image"];
		const requiredKeys = ["Url", "Price", "Name", "Manufacturer"]

        return Object.keys(currentComponentData).map((key) => {
            // Skip rendering a field for the ID or other unwanted fields
            if (excludeKeys.includes(key)) return null;
			if (requiredKeys.includes(key)) return (
                <div key={key}>
                    <Input required type="text" name={key} placeholder={key} />
                    <br /><br />
                </div>
            )

            return (
                <div key={key}>
                    <Input type="text" name={key} placeholder={key} />
                    <br /><br />
                </div>
            );
        });
    };
	*/

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log(formFields)

		const submitComponent = currentComponent
		const newUrl = event.target.Url.value;
		const newPrice = event.target.Price.value;
		const newName = event.target.Name.value;
		const newManufacturer = event.target.Manufacturer.value;

		// Check if any field is filled
		if (!newUrl && !newPrice && !newName && !newManufacturer) {
			alert("Please fill in the required fields!");
			return;
		}

		try {
			await handleAddComponentsAdmin(event, submitComponent, formFields); // Assumes this function handles the event correctly
		} catch (error) {
			console.error('Error adding part:', error);
			alert('Error updating credentials.');
		}
	};


	return (
	<div>
		<p>All Components!</p>
	{currentComponent &&  (
	  <div id="componentform" style={{ marginBottom: "25em"}}>
	  	<form onSubmit={handleSubmit} className="adminForm">
		<div><button className="closeForm" onClick={() => closeForm()}>x</button></div>
		<p>{currentComponent}</p>
			{renderDynamicFormFields()}
		<div>
		  <Button variant="contained" type="submit">
			Add {currentComponent}
		  </Button>
		</div>
		</form>
	  </div>

				)}
			<div id="content">
				<div><button onClick={() => handleNewComponent("chassis")}>Add new chassis</button></div>
				<div className="component-list" style={{ padding: "1em"}}>
					<ul> 
						{cases.map((caseItem) => (
							<li key={caseItem.ID}>{caseItem.Manufacturer} - {caseItem.Name}</li>
						))}
					</ul>
				</div>
				<div><button onClick={() => handleNewComponent("cpu")}>Add new cpu</button></div>
				<div className="component-list" style={{ padding: "1em"}}>
					<ul> 
						{cpus.map((cpuItem) => (
							<li key={cpuItem.ID}>{cpuItem.Manufacturer} - {cpuItem.Name}</li>
						))}
					</ul>
				</div>
				<div><button onClick={() => handleNewComponent("cpu_cooler")}>Add new cpu cooler</button></div>
				<div className="component-list" style={{ padding: "1em"}}>
					<ul> 
						{cpuCoolers.map((cpuCoolerItem) => (
							<li key={cpuCoolerItem.ID}>{cpuCoolerItem.Manufacturer} - {cpuCoolerItem.Name}</li>
						))}
					</ul>
				</div>
				<div><button onClick={() => handleNewComponent("gpu")}>Add new gpu</button></div>
				<div className="component-list" style={{ padding: "1em"}}>
					<ul> 
						{gpus.map((gpuItem) => (
							<li key={gpuItem.ID}>{gpuItem.Manufacturer} - {gpuItem.Name}</li>
						))}
					</ul>
				</div>
				<div><button onClick={() => handleNewComponent("memory")}>Add new memory</button></div>
				<div className="component-list" style={{ padding: "1em"}}>
					<ul> 
						{memories.map((memoryItem) => (
							<li key={memoryItem.ID}>{memoryItem.Manufacturer} - {memoryItem.Name}</li>
						))}
					</ul>
				</div>
				<div><button onClick={() => handleNewComponent("motherboard")}>Add new motherboard</button></div>
				<div className="component-list" style={{ padding: "1em"}}>
					<ul>
						{motherboards.map((motherboardItem) => (
							<li key={motherboardItem.ID}>{motherboardItem.Manufacturer} - {motherboardItem.Name}</li>
						))}
					</ul>
				</div>
				<div><button onClick={() => handleNewComponent("psu")}>Add new psu</button></div>
				<div className="component-list" style={{ padding: "1em"}}>
					<ul> 
						{psus.map((psuItem) => (
							<li key={psuItem.ID}>{psuItem.Manufacturer} - {psuItem.Name}</li>
						))}
					</ul>
				</div>
				<div><button onClick={() => handleNewComponent("storage")}>Add new storage</button></div>
				<div className="component-list" style={{ padding: "1em"}}>
					<ul> 
						{storages.map((storageItem) => (
							<li key={storageItem.ID}>{storageItem.Manufacturer} - {storageItem.Name}</li>
						))}
					</ul>
				</div>
			</div>
			</div>
	);
} 

export default ComponentsAdmin