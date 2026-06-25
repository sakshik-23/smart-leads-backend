package com.smartleads.service;

import java.util.List;

import com.smartleads.dto.request.LeadRequest;
import com.smartleads.dto.response.LeadResponse;
import com.smartleads.dto.response.PagedLeadResponse;
import com.smartleads.enums.LeadSource;
import com.smartleads.enums.LeadStatus;

public interface LeadService {

    LeadResponse createLead(LeadRequest request);

    LeadResponse updateLead(Long id, LeadRequest request);

    void deleteLead(Long id);

    LeadResponse getLeadById(Long id);

    PagedLeadResponse getAllLeads(
            LeadStatus status,
            LeadSource source,
            String search,
            Long assignedToId,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    List<LeadResponse> getLeadsListForExport(
            LeadStatus status,
            LeadSource source,
            String search,
            Long assignedToId
    );
}
