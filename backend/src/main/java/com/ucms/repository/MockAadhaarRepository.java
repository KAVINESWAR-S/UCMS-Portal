package com.ucms.repository;

import com.ucms.model.MockAadhaar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MockAadhaarRepository extends JpaRepository<MockAadhaar, Long> {

    Optional<MockAadhaar> findByAadhaarNumber(String aadhaarNumber);

    Optional<MockAadhaar> findByEmailIgnoreCase(String email);

    boolean existsByAadhaarNumber(String aadhaarNumber);
}
