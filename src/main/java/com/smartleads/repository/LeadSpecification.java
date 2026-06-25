package com.smartleads.repository;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.smartleads.entity.Lead;
import com.smartleads.enums.LeadSource;
import com.smartleads.enums.LeadStatus;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class LeadSpecification {

    public static Specification<Lead> filterLeads(
            LeadStatus status,
            LeadSource source,
            String search,
            Long assignedToId
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (source != null) {
                predicates.add(cb.equal(root.get("source"), source));
            }

            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), searchPattern);
                Predicate emailLike = cb.like(cb.lower(root.get("email")), searchPattern);
                predicates.add(cb.or(nameLike, emailLike));
            }

            if (assignedToId != null) {
                predicates.add(cb.equal(root.get("assignedTo").get("id"), assignedToId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
