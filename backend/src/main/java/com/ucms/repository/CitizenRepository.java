package com.ucms.repository;

import com.ucms.model.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CitizenRepository extends JpaRepository<Citizen, Long> {

    Optional<Citizen> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Citizen> findByAadhaarNumber(String aadhaarNumber);

    boolean existsByAadhaarNumber(String aadhaarNumber);

    java.util.List<Citizen> findByVillage(String village);

    java.util.List<Citizen> findByVillageIgnoreCase(String village);

    java.util.List<Citizen> findByRole(com.ucms.model.Role role);

    java.util.List<Citizen> findByRoleOrderByFullNameAsc(com.ucms.model.Role role);

    long countByRole(com.ucms.model.Role role);

    long countByVillageIgnoreCase(String village);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT c.village FROM Citizen c WHERE c.village IS NOT NULL")
    java.util.List<String> findDistinctVillages();
}

