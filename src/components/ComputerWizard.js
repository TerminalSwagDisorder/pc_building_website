import React, { useState } from "react";
import Button from '@mui/material/Button';

const ComputerWizard = ({ onSubmit, currentUser, setCurrentUser, handleComputerWizard, refreshProfileData }) => {
	const [currentOperation, setCurrentOperation] = useState("wizard");
	// Do the wizard form initialization this way
	const [formFields, setFormFields] = useState({
		"price": 0,
		"useCase": "noPreference",
		"performancePreference": "noPreference",
		"formFactor": "noPreference",
		"colorPreference": "noPreference",
		"otherColor": "",
		"rgbPreference": "noPreference",
		"cpuManufacturer": "noPreference",
		"gpuManufacturer": "noPreference",
		"psuBias": "noPreference",
		"storageBias": "noPreference",
		"additionalStorage": "noPreference",
	});

	const closeForm = () => {
		setCurrentOperation("")
	};


	const handleComputerWizardForm = (operation) => {
		setCurrentOperation(operation);
	};


	const handleInputChange = (event) => {
		console.log(event.target.value);
		setFormFields(prevFields => ({
			...prevFields,
			[event.target.name]: event.target.value
		}));
		if (event.target.name === "price") {
			let priceValue = parseInt(event.target.value, 10);
			// If the ID goes beyond the range, loop it back
			if (priceValue < 0) {
				priceValue = 500;
			} 
			if (priceValue > 5000) {
				priceValue = 5000;
			}
			event.target.value = priceValue

		}

	};

	const formatWizardBuilds = () => {
		if (currentUser.Completed_builds) {
			let completedBuilds = JSON.parse(currentUser.Completed_builds)
			console.log(completedBuilds)

		return completedBuilds.map((build) => (
			<div key={build.ID}>
				{Object.keys(build).map((key) => (
					<p key={key}>{key}: {build[key]}</p>
				))}
				<br></br>
			</div>
		));
		}
	};

	
	const renderComputerWizard = () => {
		if (currentOperation === "wizard" || currentOperation === "wizardAdvanced") {
		return (  
			<div id="userform">
			<form onSubmit={handleSubmit} className="wizardForm">
			<div><button className="closeForm" onClick={() => closeForm()}>x</button></div>
			<h2>Computer wizard</h2>
			<br></br>
			<div>
				<label for="price" className="wizardLabel">Max price (500-5000): </label>
				<input type="number" name="price" min="500" max="5000" step="50" onChange={handleInputChange} required />
			</div><br></br>
			<div>
				<label for="useCase" className="wizardLabel">Use case: </label>
				<select name="useCase" value={formFields.useCase} onChange={handleInputChange}>
					<option value="noPreference">No preference</option>
					<option value="gaming">Gaming</option>
					<option value="work">Work/Office</option>
					<option value="streaming">Streaming</option>
					<option value="generalUse">General Use/Browsing</option>
					<option value="editing">Video/Photo editing</option>
					<option value="workstation">Workstation</option>
				</select>
			</div><br></br>
			<div>
			<label for="performancePreference" className="wizardLabel">Performance preference: </label>
				<select name="performancePreference" value={formFields.performancePreference} onChange={handleInputChange}>
					<option value="noPreference">No preference</option>
					<option value="maxGpu">Maximum graphics power</option>
					<option value="maxCpu">Maximum processing power</option>
					<option value="maxRamAmount">Maximum ram amount</option>
					<option value="maxRamSpeed">Maximum ram speed</option>
					<option value="maxStorageAmount">Maximum storage amount</option>
					<option value="maxEfficiency">Maximum efficiency</option>
				</select>
			</div><br></br>
			<div>
			<label for="formFactor" className="wizardLabel">Size preference: </label>
				<select name="formFactor" value={formFields.formFactor} onChange={handleInputChange}>
					<option value="noPreference">No preference</option>
					<option value="smallest">Smallest possible/HTPC sized</option>
					<option value="small">Smaller ITX sized</option>
					<option value="medium">Regular ATX sized</option>
					<option value="large">Larger E-ATX sized</option>
					<option value="largest">No upper limit</option>
				</select>
			</div><br></br>
			<div>
			<label for="colorPreference" className="wizardLabel">Color preference: </label>
				<select name="colorPreference" value={formFields.colorPreference} onChange={handleInputChange}>
					<option value="noPreference">No preference</option>
					<option value="black">Black</option>
					<option value="white">White</option>
					<option value="red">Red</option>
					<option value="blue">Blue</option>
					<option value="other">Other</option>
				</select>
			{ formFields.colorPreference === "other" ? (
				<input type="text" name="otherColor" placeholder="Choose any other color" onChange={handleInputChange} />
				) : (
				<input type="text" name="otherColor" placeholder="Choose any other color" onChange={handleInputChange} disabled />
			)}
			</div><br></br>
			<div>
			<label for="rgbPreference" className="wizardLabel">RGB lighting preference: </label>
				<select name="rgbPreference" value={formFields.rgbPreference} onChange={handleInputChange}>
					<option value="noPreference">No preference</option>
					<option value="noRgb">No RGB if possible</option>
					<option value="minimumRgb">Small amount of rgb</option>
					<option value="largeRgb">Large amount of rgb</option>
					<option value="maximumRgb">Maximum amount of rgb</option>
				</select>
			</div><br></br>

				{renderAdvancedButton()}
				<br></br>
				{renderAdvancedComputerWizard()}
				<br></br>

			<Button variant="contained" type="submit">
				Build computer!
			</Button>
			</form>
			</div>
		);
	  } else {
		return ( 
			<div className="userCredentialChange">
			<div><button onClick={() => handleComputerWizardForm("wizard")}>Start to build a computer!</button></div>
			</div>
		);
	  }
	};

	const renderAdvancedComputerWizard = () => {
		if (currentOperation === "wizardAdvanced") {
			return (
			<div>
			<div>
			<label for="cpuManufacturer" className="wizardLabel">Cpu manufacturer: </label>
				<select name="cpuManufacturer" value={formFields.cpuManufacturer} onChange={handleInputChange}>
					<option value="noPreference">No preference</option>
					<option value="amdPreference">AMD</option>
					<option value="intelPreference">Intel</option>
				</select>
			</div><br></br>
			<div>
			<label for="gpuManufacturer" className="wizardLabel">Gpu manufacturer: </label>
				<select name="gpuManufacturer" value={formFields.gpuManufacturer} onChange={handleInputChange}>
					<option value="noPreference">No preference</option>
					<option value="amdPreference">AMD</option>
					<option value="nvidiaPreference">NVIDIA</option>
					<option value="intelPreference">Intel</option>
				</select>
			</div><br></br>
			<div>
			<label for="psuBias" className="wizardLabel">Power supply bias: </label>
				<select name="psuBias" value={formFields.psuBias} onChange={handleInputChange}>
					<option value="noPreference">No preference</option>
					<option value="bestEfficiency">Better efficiency/Lower wattage</option>
					<option value="balanced">Balanced efficiency & wattage</option>
					<option value="highWattage">Higher wattage/Worse efficiency</option>
				</select>
			</div><br></br>
			<div>
			<label for="storageBias" className="wizardLabel">Storage bias: </label>
				<select name="storageBias" value={formFields.storageBias} onChange={handleInputChange}>
					<option value="noPreference">No preference</option>
					<option value="onlyM2">Only m.2 SSDs</option>
					<option value="onlySsd">Only any SSDs</option>
					<option value="bootSsd">Boot SSD with any mixture of storage</option>
					<option value="balanced">Any mixture of storage</option>
					<option value="onlyHdd">Only HDDs</option>
				</select>
			</div><br></br>
			<div>
			<label for="additionalStorage" className="wizardLabel">Additional storage: </label>
				<select name="additionalStorage" value={formFields.additionalStorage} onChange={handleInputChange}>
					<option value="noPreference">No preference</option>
					<option value="noAdded">No additional storage</option>
					<option value="oneAdded">1 extra storage drive</option>
					<option value="twoAdded">2 extra storage drives</option>
					<option value="threeAdded">3 extra storage drives</option>
					<option value="maxAdded">As many as I can get</option>

				</select>
			</div><br></br>
			</div>
			);
		}
	};

	const renderAdvancedButton = () => {
		if (currentOperation === "wizardAdvanced") {
			return (
				<div>
					<h3 className="setWizardAdvanced" onClick={() => handleComputerWizardForm("wizard")}>Advanced ▲</h3>
				</div>
			);
		} else {
			return (
				<div>
					<h3 className="setWizardAdvanced" onClick={() => handleComputerWizardForm("wizardAdvanced")}>Advanced ▼</h3>
				</div>
			);
		}
	};


	// Function for when the user submits the form
	const handleSubmit = async (event) => {
		event.preventDefault();
		
		if (Number.isNaN(formFields.price) || formFields.price === 0 || formFields.price === undefined) {
			alert("Price must be a number between 500-5000")
		}
		
		if (formFields.price < 500 || formFields.price > 5000) {
			alert("Price must be between 500-5000")
		}

		if (formFields.otherColor !== "" && formFields.colorPreference !== "other") {
			let resetValue = ""
			event.target.otherColor.value = resetValue
			formFields.otherColor = resetValue
		}
		
		try {
			//console.log(formFields)
			await handleComputerWizard(event, formFields, setCurrentUser);
			await refreshProfileData()
		} catch (error) {
			console.error("Error updating credentials:", error);
			alert("Error updating credentials.");
		}
	};


	return ( 
		<div>
		<div>
		{renderComputerWizard()} 
		<br></br>
		</div>
		 <div>
		 {formatWizardBuilds()}
		 </div>
		</div>
	  );
	}

export default ComputerWizard