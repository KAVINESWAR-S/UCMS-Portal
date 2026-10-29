package com.ucms.service;

import com.ucms.dto.CitizenDto;
import com.ucms.model.Citizen;
import com.ucms.repository.CitizenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CitizenService {

    private final CitizenRepository citizenRepository;

    public CitizenService(CitizenRepository citizenRepository) {
        this.citizenRepository = citizenRepository;
    }

    @Transactional(readOnly = true)
    public CitizenDto getProfileByEmail(String email) {
        Citizen citizen = citizenRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Citizen profile not found for email: " + email));
        return CitizenDto.fromEntity(citizen);
    }

    @Transactional
    public CitizenDto updateProfile(String email, CitizenDto updateDto) {
        Citizen citizen = citizenRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Citizen profile not found for email: " + email));

        // Reject attempt to modify verified Panchayat
        String requestedVillage = updateDto.getVillage() != null ? updateDto.getVillage().trim() : (updateDto.getPanchayatName() != null ? updateDto.getPanchayatName().trim() : null);
        if (requestedVillage != null && !requestedVillage.isEmpty() && !requestedVillage.equalsIgnoreCase(citizen.getVillage())) {
            throw new IllegalArgumentException("Panchayat / Village cannot be changed. It is permanently bound to your verified UIDAI Aadhaar record: " + citizen.getVillage());
        }

        // Reject attempt to alter Aadhaar number
        if (updateDto.getAadhaarNumber() != null && citizen.getAadhaarNumber() != null) {
            String cleanInput = updateDto.getAadhaarNumber().replaceAll("[^0-9]", "");
            String cleanExisting = citizen.getAadhaarNumber().replaceAll("[^0-9]", "");
            if (!cleanInput.isEmpty() && !cleanInput.equals(cleanExisting)) {
                throw new IllegalArgumentException("Aadhaar Number is verified and cannot be altered.");
            }
        }

        // Allow updating permitted custom fields
        if (updateDto.getPhoneNumber() != null && !updateDto.getPhoneNumber().trim().isEmpty()) {
            citizen.setPhoneNumber(updateDto.getPhoneNumber().trim());
        }
        if (updateDto.getAddress() != null && !updateDto.getAddress().trim().isEmpty()) {
            citizen.setAddress(updateDto.getAddress().trim());
        }
        if (updateDto.getOccupation() != null) citizen.setOccupation(updateDto.getOccupation().trim());
        if (updateDto.getAnnualIncome() != null) citizen.setAnnualIncome(updateDto.getAnnualIncome());
        if (updateDto.getLandArea() != null) citizen.setLandArea(updateDto.getLandArea());
        if (updateDto.getFarmerStatus() != null) citizen.setFarmerStatus(updateDto.getFarmerStatus());

        Citizen saved = citizenRepository.save(citizen);
        return CitizenDto.fromEntity(saved);
    }
}
