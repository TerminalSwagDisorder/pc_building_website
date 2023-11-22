import React, { useState, useEffect } from "react";
import { checkIfSignedIn } from "../api";
import { Input } from '@mui/material';
import Button from '@mui/material/Button';


const ComponentsAdmin = ({ currentUser, handleComponentAddAdmin, handleComponentChangeAdmin, chassis, cpus, cpuCoolers, gpus, memories, motherboards, psus, storages }) => {
	const [currentComponent, setCurrentComponent] = useState("");
	const [currentComponentData, setCurrentComponentData] = useState(null);
	const [currentOperation, setCurrentOperation] = useState("")
	const [inputValue, setInputValue] = useState("");
	const [formFields, setFormFields] = useState({});

    // Array of component types and their data
    const componentTypes = [
        { name: "chassis", data: chassis },
        { name: "cpu", data: cpus },
        { name: "cpu_cooler", data: cpuCoolers },
        { name: "gpu", data: gpus },
        { name: "memory", data: memories },
        { name: "motherboard", data: motherboards },
        { name: "psu", data: psus },
        { name: "storage", data: storages },
    ];

    const handleSetComponent = (componentType, data, operation) => {
        setCurrentComponent(componentType);
		setCurrentComponentData(data);
		setCurrentOperation(operation);
		console.log(componentType, data, operation)
    };
	
	//console.log(currentComponent, currentComponentData)
	
	const closeForm = (componentType) => {
		setCurrentComponent(null)
	}

    const handleInputChange = (event) => {
		const component = componentTypes.find((item) => item.name === currentComponent).data;
		setInputValue(event.target.value);
		console.log(event.target.name, event.target.value)
		setFormFields(prevFields => ({
			...prevFields,
			[event.target.name]: event.target.value
		}));
		if (event.target.id) {
			let componentId = parseInt(event.target.value, 10);
			console.log("componentId", componentId)
			// If the ID goes beyond the range, loop it back
			if (componentId < component[0].ID) {
				componentId = component[component.length - 1].ID;
			} 
			if (componentId > component[component.length - 1].ID) {
				componentId = component[0].ID;
			}
			if (!componentId) {
				componentId = component[0].ID;
			}

			const selectedComponent = component.find(item => item.ID === componentId);
			setCurrentComponentData(selectedComponent);
		}
	};

	// For dynamically rendering a form for each component type 
	const renderDynamicFormFields = () => {
		if (!currentComponentData) return null;
		const excludeKeys = ["Image_Url"];
		const requiredKeys = ["Url", "Price", "Name", "Manufacturer"];
		const imageKeys = ["Image"]
		const numberKeys = ["ID", "Price"]
		

		return Object.keys(currentComponentData).map((key) => {
			if (excludeKeys.includes(key)) return null;
			
			const isRequired = requiredKeys.includes(key)
			const isImage = imageKeys.includes(key)
			const isNumber = numberKeys.includes(key)
			const chosenComponentType = componentTypes.find((item) => item.name === currentComponent).data;
			let inputType;
			
			if (currentOperation === "add") {
				if (isImage) {
					inputType = (
						<Input type="file" name={key} onChange={handleInputChange} />
					);
				} else if (isNumber) {
					if (key === "ID") {
					inputType = (
						<input id="id" disabled type="number" name={key} placeholder="ID" value="" onChange={handleInputChange} step="1" style={{backgroundColor: "gray"}}/>
					);
					} else {
						inputType = (
							<input required={isRequired}  type="number" name={key} placeholder={key} onChange={handleInputChange} step="0.01" style={{backgroundColor: "gray"}}/>
						);
					}
				} else {
					inputType = (
						<Input required={isRequired} type="text" name={key} placeholder={key} onChange={handleInputChange} />
					);
				}
			} else if (currentOperation === "update") {
				if (isImage) {
					inputType = (
						<Input type="file" name={key} onChange={handleInputChange} />
					);
				} else if (isNumber) {
					if (key === "ID") {
					inputType = (
						<input id="id" type="number" name={key} value={currentComponentData.ID} onChange={handleInputChange} step="1" min={chosenComponentType[0].ID} max={chosenComponentType[chosenComponentType.length - 1].ID} style={{backgroundColor: "gray"}}/>
					);
					} else {
						inputType = (
							<input type="number" name={key} placeholder={currentComponentData[key]} onChange={handleInputChange} step="0.01" style={{backgroundColor: "gray"}}/>
						);
					}
				} else {
					inputType = (
						<Input type="text" name={key} placeholder={currentComponentData[key]} onChange={handleInputChange} />
					);
				}
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

	// For rendering the component list recursively
	const renderDynamicComponents = () => {
		return componentTypes.map((component) => (
		<div key={component.name}>
			<div><button onClick={() => handleSetComponent(component.name, component.data[0], "add")}>Add new {component.name}</button></div>
			<div className="component-list" style={{ padding: "1em"}}>
				<ul> 
					{component.data.map((item) => (
						<div key={item.ID} className="adminComponentList">
						<li>{item.ID}: {item.Manufacturer} - {item.Name.slice(0, 40)}
							<button onClick={() => handleSetComponent(component.name, item, "update")}>Modify {item.Name}</button>
						</li>
						</div>
					))}
				</ul>
			</div>
		</div>
		))
	};

	// This way of recursive rendering is also valid and has some other benefits than renderDynamicComponents,
	// however the form that is summoned from the buttons renders slower.
/*
	const RenderComponents = ({ componentName, componentData, onAddClick }) => {
		return (
			<div>
				<div><button onClick={() => onAddClick(componentName)}>Add new {componentName}</button></div>
				<div className="component-list" style={{ padding: "1em" }}>
					<ul>
						{componentData.map((item) => (
							<li key={item.ID}>{item.Manufacturer} - {item.Name}</li>
						))}
					</ul>
				</div>
			</div>
		);
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
		if (currentOperation === "add" && !newUrl && !newPrice && !newName && !newManufacturer) {
			alert("Please fill in the required fields!");
			return;
		}

		try {
			if (currentOperation === "add") {	
				await handleComponentAddAdmin(event, submitComponent, formFields);
			} else if (currentOperation === "update") {
				await handleComponentChangeAdmin(event, submitComponent, formFields, currentComponentData.ID)
			}
		} catch (error) {
			console.error("Error adding or modifying part:", error);
			alert("Error adding or modifying part:", error);
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
			{currentOperation} {currentComponent}
		  </Button>
		</div>
		</form>
	  </div>
				)}
	<div id="content">
	{renderDynamicComponents()}
	
	
	{/* For use with RenderComponents if preferred instead of renderDynamicComponents */}
	{/* 
		{componentTypes.map((type) => (
			<RenderComponents
				key={type.name}
				componentName={type.name}
				componentData={type.data}
				onAddClick={handleSetComponent}
			/>
		))}
	*/}
			</div>
			</div>
	);
} 

export default ComponentsAdmin