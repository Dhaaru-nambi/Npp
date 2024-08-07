package com.project.npp.service;

import java.util.List;

import com.project.npp.entities.PortRequest;
import com.project.npp.exceptions.CustomerNotFoundException;
import com.project.npp.exceptions.LogNotFoundException;
import com.project.npp.exceptions.OperatorNotFoundException;
import com.project.npp.exceptions.PortRequestNotFoundException;
import com.project.npp.exceptions.VerificationDetailsNotFoundException;

public interface PortRequestService {
	
	// Add port request
	public PortRequest addPortRequest(PortRequest portRequest);

	// Get port request
	public PortRequest getPortRequest(Integer portRequestId) throws PortRequestNotFoundException;

	// Update port request
	public PortRequest updatePortRequest(PortRequest portRequest)
			throws CustomerNotFoundException, PortRequestNotFoundException, LogNotFoundException, OperatorNotFoundException, VerificationDetailsNotFoundException;

	// Delete port request
	public String deletePortRequest(Integer portRequestId) throws PortRequestNotFoundException;

	// Get all post requests
	public List<PortRequest> getAllPortRequest() throws PortRequestNotFoundException;
}