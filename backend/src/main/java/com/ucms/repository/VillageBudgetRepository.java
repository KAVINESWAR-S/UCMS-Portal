package com.ucms.repository;

import com.ucms.model.VillageBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VillageBudgetRepository extends JpaRepository<VillageBudget, Long> {

    Optional<VillageBudget> findByVillageIgnoreCaseAndFinancialYear(String village, String financialYear);

    List<VillageBudget> findByVillageIgnoreCase(String village);

    List<VillageBudget> findByFinancialYear(String financialYear);
}
