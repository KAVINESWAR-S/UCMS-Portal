package com.ucms.controller;

import com.ucms.dto.ServiceRequestCreateRequest;
import com.ucms.dto.ServiceRequestDto;
import com.ucms.service.ServiceRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizen/service-requests")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    public ServiceRequestController(ServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @PostMapping
    public ResponseEntity<ServiceRequestDto> createServiceRequest(
            Authentication authentication,
            @RequestBody ServiceRequestCreateRequest request
    ) {
        ServiceRequestDto dto = serviceRequestService.createServiceRequest(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequestDto>> getMyServiceRequests(Authentication authentication) {
        List<ServiceRequestDto> list = serviceRequestService.getCitizenServiceRequests(authentication.getName());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestDto> getServiceRequestDetails(@PathVariable Long id) {
        ServiceRequestDto dto = serviceRequestService.getServiceRequestById(id);
        return ResponseEntity.ok(dto);
    }
}
