package com.ucms.controller;

import com.ucms.dto.ServiceRequestDto;
import com.ucms.dto.ServiceRequestReviewRequest;
import com.ucms.service.ServiceRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officer/service-requests")
public class OfficerServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    public OfficerServiceRequestController(ServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequestDto>> getAllServiceRequests(@RequestParam(required = false) String village) {
        List<ServiceRequestDto> list = (village != null && !village.trim().isEmpty())
                ? serviceRequestService.getServiceRequestsByVillage(village.trim())
                : serviceRequestService.getAllServiceRequests();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestDto> getServiceRequestDetails(@PathVariable Long id) {
        ServiceRequestDto dto = serviceRequestService.getServiceRequestById(id);
        return ResponseEntity.ok(dto);
    }

    @RequestMapping(value = "/{id}/review", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<ServiceRequestDto> reviewServiceRequest(
            @PathVariable Long id,
            @RequestBody ServiceRequestReviewRequest request
    ) {
        ServiceRequestDto dto = serviceRequestService.reviewServiceRequest(id, request);
        return ResponseEntity.ok(dto);
    }
}
