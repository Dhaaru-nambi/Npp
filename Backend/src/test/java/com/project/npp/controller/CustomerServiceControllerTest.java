package com.project.npp.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.project.npp.entities.Customer;
import com.project.npp.entities.Operator;
import com.project.npp.entities.PortRequest;
import com.project.npp.entities.Status;
import com.project.npp.entities.request.CustomerRequest;
import com.project.npp.entities.request.GetCustomerRequest;
import com.project.npp.entities.request.GetPortRequest;
import com.project.npp.entities.request.UpdateCustomerRequest;
import com.project.npp.entities.request.UpdatePortRequest;
import com.project.npp.entities.request.UserPortRequest;
import com.project.npp.exceptions.CustomerNotFoundException;
import com.project.npp.exceptions.OperatorNotFoundException;
import com.project.npp.exceptions.PortRequestNotFoundException;
import com.project.npp.service.CustomerService;
import com.project.npp.service.OperatorService;
import com.project.npp.service.PortRequestService;

@ExtendWith(MockitoExtension.class)
public class CustomerServiceControllerTest {

	@InjectMocks
	private CustomerServiceController customerServiceController;

	@Mock
	private OperatorService operatorService;

	@Mock
	private CustomerService customerService;

	@Mock
	private PortRequestService portRequestService;

	private CustomerRequest customerRequest;
	private Customer customer;
	private Operator operator;
	private PortRequest portRequest;
	private UserPortRequest userPortRequest;
	private UpdateCustomerRequest updateCustomerRequest;
	private UpdatePortRequest updatePortRequest;

	@BeforeEach
	void setUp() {
		customerRequest = new CustomerRequest();
		customerRequest.setName("Test Customer");
		customerRequest.setEmail("test@example.com");
		customerRequest.setPhoneNumber(1234567890L);
		customerRequest.setCurrentOperatorId(1);
		customerRequest.setNewOperatorId(2);

		customer = new Customer();
		customer.setCustomerId(1);
		customer.setName("Test Customer");
		customer.setEmail("test@example.com");
		customer.setPhoneNumber(1234567890L);

		operator = new Operator();
		operator.setOperatorId(1);
		operator.setOperatorName("Test Operator");

		portRequest = new PortRequest();
		portRequest.setRequestId(1);
		portRequest.setRequestDate(LocalDate.of(2023, 06, 05));

		userPortRequest = new UserPortRequest();
		userPortRequest.setCustomerId(1);
		userPortRequest.setRequestDate(LocalDate.of(2023, 06, 05));

		updateCustomerRequest = new UpdateCustomerRequest();
		updateCustomerRequest.setCustomerId(1);
		updateCustomerRequest.setName("Updated Customer");
		updateCustomerRequest.setEmail("updated@example.com");
		updateCustomerRequest.setPhoneNumber(678765677L);
		updateCustomerRequest.setCurrentOperatorId(1);
		updateCustomerRequest.setNewOperatorId(2);
		updateCustomerRequest.setStatus(Status.COMPLETED);

		updatePortRequest = new UpdatePortRequest();
		updatePortRequest.setRequestId(1);
		updatePortRequest.setRequestDate(LocalDate.of(2023, 06, 05));
		updatePortRequest.setCustomerId(1);
	}

	@Test
	void testAddCustomer() throws OperatorNotFoundException {
		when(operatorService.getOperatorById(1)).thenReturn(operator);
		when(operatorService.getOperatorById(2)).thenReturn(operator);
		when(customerService.addCustomer(any(Customer.class))).thenReturn(customer);

		ResponseEntity<Customer> response = customerServiceController.addCustomer(customerRequest);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(customer, response.getBody());
	}

	@Test
	void testAddCustomerOperatorNotFound() throws OperatorNotFoundException {
		when(operatorService.getOperatorById(1)).thenThrow(new OperatorNotFoundException("Operator not found"));

		assertThrows(OperatorNotFoundException.class, () -> {
			customerServiceController.addCustomer(customerRequest);
		});
	}

	@Test
	void testGetCustomer() throws CustomerNotFoundException {
		when(customerService.getCustomerById(1)).thenReturn(customer);

		ResponseEntity<Customer> response = customerServiceController.getCustomer(1);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(customer, response.getBody());
	}

	@Test
	void testGetCustomerNotFound() throws CustomerNotFoundException {
		when(customerService.getCustomerById(1)).thenThrow(new CustomerNotFoundException("Customer not found"));

		assertThrows(CustomerNotFoundException.class, () -> {
			customerServiceController.getCustomer(1);
		});
	}
	
	@Test
    public void testGetCustomerByRequestBody_Success() throws CustomerNotFoundException {
        // Arrange
        GetCustomerRequest getCustomerRequest = new GetCustomerRequest();
        getCustomerRequest.setCustomerId(1);

        Customer customer = new Customer();
        customer.setCustomerId(1);
        customer.setName("John Doe");

        when(customerService.getCustomerById(anyInt())).thenReturn(customer);

        // Act
        ResponseEntity<Customer> response = customerServiceController.getCustomer(getCustomerRequest);

        // Assert
        assert(response.getStatusCode() == HttpStatus.OK);
        assert(response.getBody().equals(customer));
    }

    @Test
    public void testGetCustomerByRequestBody_CustomerNotFound() throws CustomerNotFoundException {
        // Arrange
        GetCustomerRequest getCustomerRequest = new GetCustomerRequest();
        getCustomerRequest.setCustomerId(1);

        when(customerService.getCustomerById(anyInt())).thenThrow(new CustomerNotFoundException("Customer not found"));

        // Act & Assert
        assertThrows(CustomerNotFoundException.class, () -> {
            customerServiceController.getCustomer(getCustomerRequest);
        });
    }

	@Test
	void testUpdateCustomer() throws OperatorNotFoundException, CustomerNotFoundException {
		when(operatorService.getOperatorById(1)).thenReturn(operator);
		when(operatorService.getOperatorById(2)).thenReturn(operator);
		when(customerService.updateCustomer(any(Customer.class))).thenReturn(customer);

		ResponseEntity<Customer> response = customerServiceController.updateCustomer(updateCustomerRequest);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(customer, response.getBody());
	}

	@Test
	void testUpdateCustomerOperatorNotFound() throws OperatorNotFoundException {
		when(operatorService.getOperatorById(1)).thenThrow(new OperatorNotFoundException("Operator not found"));

		assertThrows(OperatorNotFoundException.class, () -> {
			customerServiceController.updateCustomer(updateCustomerRequest);
		});
	}

	@Test
	void testUpdateCustomerNotFound() throws CustomerNotFoundException, OperatorNotFoundException {
		when(operatorService.getOperatorById(1)).thenReturn(operator);
		when(operatorService.getOperatorById(2)).thenReturn(operator);
		when(customerService.updateCustomer(any(Customer.class)))
				.thenThrow(new CustomerNotFoundException("Customer not found"));

		assertThrows(CustomerNotFoundException.class, () -> {
			customerServiceController.updateCustomer(updateCustomerRequest);
		});
	}

	@Test
	void testDeleteCustomer() throws CustomerNotFoundException {
		when(customerService.deleteCustomerById(1)).thenReturn("Customer deleted successfully");

		ResponseEntity<String> response = customerServiceController.deleteCustomer(1);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("Customer deleted successfully", response.getBody());
	}

	@Test
	void testDeleteCustomerNotFound() throws CustomerNotFoundException {
		when(customerService.deleteCustomerById(1)).thenThrow(new CustomerNotFoundException("Customer not found"));

		assertThrows(CustomerNotFoundException.class, () -> {
			customerServiceController.deleteCustomer(1);
		});
	}
	
	@Test
    public void testDeleteCustomerByRequestBody_Success() throws CustomerNotFoundException {
        // Arrange
        GetCustomerRequest getCustomerRequest = new GetCustomerRequest();
        getCustomerRequest.setCustomerId(1);

        String expectedMessage = "Customer deleted successfully";

        when(customerService.deleteCustomerById(anyInt())).thenReturn(expectedMessage);

        // Act
        ResponseEntity<String> response = customerServiceController.deleteCustomer(getCustomerRequest);

        // Assert
        assert(response.getStatusCode() == HttpStatus.OK);
        assert(response.getBody().equals(expectedMessage));
    }

    @Test
    public void testDeleteCustomerByRequestBody_CustomerNotFound() throws CustomerNotFoundException {
        // Arrange
        GetCustomerRequest getCustomerRequest = new GetCustomerRequest();
        getCustomerRequest.setCustomerId(1);

        when(customerService.deleteCustomerById(anyInt())).thenThrow(new CustomerNotFoundException("Customer not found"));

        // Act & Assert
        assertThrows(CustomerNotFoundException.class, () -> {
            customerServiceController.deleteCustomer(getCustomerRequest);
        });
    }


	@Test
	void testSubmitPortRequest() throws CustomerNotFoundException {
		when(customerService.getCustomerById(1)).thenReturn(customer);
		when(portRequestService.addPortRequest(any(PortRequest.class))).thenReturn(portRequest);

		ResponseEntity<PortRequest> response = customerServiceController.submitPortRequest(userPortRequest);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(portRequest, response.getBody());
	}

	@Test
	void testSubmitPortRequestCustomerNotFound() throws CustomerNotFoundException {
		when(customerService.getCustomerById(1)).thenThrow(new CustomerNotFoundException("Customer not found"));

		assertThrows(CustomerNotFoundException.class, () -> {
			customerServiceController.submitPortRequest(userPortRequest);
		});
	}

	@Test
	void testGetPortRequest() throws PortRequestNotFoundException {
		when(portRequestService.getPortRequest(1)).thenReturn(portRequest);

		ResponseEntity<PortRequest> response = customerServiceController.getPortRequest(1);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(portRequest, response.getBody());
	}

	@Test
	void testGetPortRequestNotFound() throws PortRequestNotFoundException {
		when(portRequestService.getPortRequest(1))
				.thenThrow(new PortRequestNotFoundException("Port request not found"));

		assertThrows(PortRequestNotFoundException.class, () -> {
			customerServiceController.getPortRequest(1);
		});
	}
	
	@Test
    public void testGetPortRequestByRequestBody_Success() throws PortRequestNotFoundException {
        // Arrange
        GetPortRequest getPortRequest = new GetPortRequest();
        getPortRequest.setRequestId(1);

        PortRequest portRequest = new PortRequest();
        portRequest.setRequestId(1);

        when(portRequestService.getPortRequest(anyInt())).thenReturn(portRequest);

        // Act
        ResponseEntity<PortRequest> response = customerServiceController.getPortRequest(getPortRequest);

        // Assert
        assert(response.getStatusCode() == HttpStatus.OK);
        assert(response.getBody().equals(portRequest));
    }

    @Test
    public void testGetPortRequestByRequestBody_PortRequestNotFound() throws PortRequestNotFoundException {
        // Arrange
        GetPortRequest getPortRequest = new GetPortRequest();
        getPortRequest.setRequestId(1);

        when(portRequestService.getPortRequest(anyInt())).thenThrow(new PortRequestNotFoundException("Port request not found"));

        // Act & Assert
        assertThrows(PortRequestNotFoundException.class, () -> {
            customerServiceController.getPortRequest(getPortRequest);
        });
    }

	@Test
	void testUpdatePortRequest() throws CustomerNotFoundException, PortRequestNotFoundException {
		when(customerService.getCustomerById(1)).thenReturn(customer);
		when(portRequestService.updatePortRequest(any(PortRequest.class))).thenReturn(portRequest);

		ResponseEntity<PortRequest> response = customerServiceController.updatePortRequest(updatePortRequest);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(portRequest, response.getBody());
	}

	@Test
	void testUpdatePortRequestCustomerNotFound() throws CustomerNotFoundException {
		when(customerService.getCustomerById(1)).thenThrow(new CustomerNotFoundException("Customer not found"));

		assertThrows(CustomerNotFoundException.class, () -> {
			customerServiceController.updatePortRequest(updatePortRequest);
		});
	}

	@Test
	void testUpdatePortRequestNotFound() throws PortRequestNotFoundException, CustomerNotFoundException {
		when(customerService.getCustomerById(1)).thenReturn(customer);
		when(portRequestService.updatePortRequest(any(PortRequest.class)))
				.thenThrow(new PortRequestNotFoundException("Port request not found"));

		assertThrows(PortRequestNotFoundException.class, () -> {
			customerServiceController.updatePortRequest(updatePortRequest);
		});
	}

	@Test
	void testDeletePortRequest() throws PortRequestNotFoundException {
		when(portRequestService.deletePortRequest(1)).thenReturn("Port request deleted successfully");

		ResponseEntity<String> response = customerServiceController.deletePortRequest(1);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("Port request deleted successfully", response.getBody());
	}

	@Test
	void testDeletePortRequestNotFound() throws PortRequestNotFoundException {
		when(portRequestService.deletePortRequest(1))
				.thenThrow(new PortRequestNotFoundException("Port request not found"));

		assertThrows(PortRequestNotFoundException.class, () -> {
			customerServiceController.deletePortRequest(1);
		});
	}
	
	@Test
    public void testDeletePortRequestByRequestBody_Success() throws PortRequestNotFoundException {
        // Arrange
        GetPortRequest getPortRequest = new GetPortRequest();
        getPortRequest.setRequestId(1);

        String expectedMessage = "Port request deleted successfully";

        when(portRequestService.deletePortRequest(anyInt())).thenReturn(expectedMessage);

        // Act
        ResponseEntity<String> response = customerServiceController.deletePortRequest(getPortRequest);

        // Assert
        assert(response.getStatusCode() == HttpStatus.OK);
        assert(response.getBody().equals(expectedMessage));
    }

    @Test
    public void testDeletePortRequestByRequestBody_PortRequestNotFound() throws PortRequestNotFoundException {
        // Arrange
        GetPortRequest getPortRequest = new GetPortRequest();
        getPortRequest.setRequestId(1);

        when(portRequestService.deletePortRequest(anyInt())).thenThrow(new PortRequestNotFoundException("Port request not found"));

        // Act & Assert
        assertThrows(PortRequestNotFoundException.class, () -> {
            customerServiceController.deletePortRequest(getPortRequest);
        });
    }

	@Test
	void testGetAllCustomerSuccess() throws CustomerNotFoundException {
		List<Customer> mockCustomers = new ArrayList<>();
		mockCustomers.add(customer);

		when(customerService.getAllCustomers()).thenReturn(mockCustomers);

		ResponseEntity<List<Customer>> response = customerServiceController.getAllCustomer();

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(mockCustomers, response.getBody());
		verify(customerService, times(1)).getAllCustomers();
	}

	@Test
	void testGetAllCustomerEmptyList() throws CustomerNotFoundException {
		List<Customer> mockCustomers = Collections.emptyList();

		when(customerService.getAllCustomers()).thenReturn(mockCustomers);

		ResponseEntity<List<Customer>> response = customerServiceController.getAllCustomer();

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertTrue(response.getBody().isEmpty());
		verify(customerService, times(1)).getAllCustomers();
	}

	@Test
	void testGetAllPortRequestsSuccess() throws PortRequestNotFoundException {
		List<PortRequest> mockPortRequests = new ArrayList<>();
		mockPortRequests.add(portRequest);

		when(portRequestService.getAllPortRequest()).thenReturn(mockPortRequests);

		ResponseEntity<List<PortRequest>> response = customerServiceController.getAllPortRequests();

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(mockPortRequests, response.getBody());
		verify(portRequestService, times(1)).getAllPortRequest();
	}

	@Test
	void testGetAllPortRequestsEmptyList() throws PortRequestNotFoundException {
		List<PortRequest> mockPortRequests = Collections.emptyList();

		when(portRequestService.getAllPortRequest()).thenReturn(mockPortRequests);

		ResponseEntity<List<PortRequest>> response = customerServiceController.getAllPortRequests();

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertTrue(response.getBody().isEmpty());
		verify(portRequestService, times(1)).getAllPortRequest();
	}
}
