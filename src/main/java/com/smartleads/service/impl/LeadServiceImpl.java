package com.smartleads.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smartleads.dto.request.LeadRequest;
import com.smartleads.dto.response.LeadResponse;
import com.smartleads.dto.response.PagedLeadResponse;
import com.smartleads.entity.Lead;
import com.smartleads.entity.User;
import com.smartleads.enums.LeadSource;
import com.smartleads.enums.LeadStatus;
import com.smartleads.exception.ResourceNotFoundException;
import com.smartleads.repository.LeadRepository;
import com.smartleads.repository.LeadSpecification;
import com.smartleads.repository.UserRepository;
import com.smartleads.service.LeadService;

@Service
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    public LeadServiceImpl(LeadRepository leadRepository, UserRepository userRepository) {
        this.leadRepository = leadRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public LeadResponse createLead(LeadRequest request) {
        Lead lead = new Lead();
        lead.setName(request.getName());
        lead.setEmail(request.getEmail());
        lead.setStatus(request.getStatus());
        lead.setSource(request.getSource());

        if (request.getAssignedToId() != null) {
            User user = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            lead.setAssignedTo(user);
        }

        Lead savedLead = leadRepository.save(lead);
        return mapToResponse(savedLead);
    }

    @Override
    @Transactional
    public LeadResponse updateLead(Long id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));

        lead.setName(request.getName());
        lead.setEmail(request.getEmail());
        lead.setStatus(request.getStatus());
        lead.setSource(request.getSource());

        if (request.getAssignedToId() != null) {
            User user = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            lead.setAssignedTo(user);
        } else {
            lead.setAssignedTo(null);
        }

        Lead updatedLead = leadRepository.save(lead);
        return mapToResponse(updatedLead);
    }

    @Override
    @Transactional
    public void deleteLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        leadRepository.delete(lead);
    }

    @Override
    @Transactional(readOnly = true)
    public LeadResponse getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        return mapToResponse(lead);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedLeadResponse getAllLeads(
            LeadStatus status,
            LeadSource source,
            String search,
            Long assignedToId,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Lead> spec = LeadSpecification.filterLeads(status, source, search, assignedToId);
        Page<Lead> leadsPage = leadRepository.findAll(spec, pageable);

        List<LeadResponse> content = leadsPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedLeadResponse(
                content,
                leadsPage.getNumber(),
                leadsPage.getSize(),
                leadsPage.getTotalElements(),
                leadsPage.getTotalPages(),
                leadsPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeadResponse> getLeadsListForExport(
            LeadStatus status,
            LeadSource source,
            String search,
            Long assignedToId
    ) {
        Specification<Lead> spec = LeadSpecification.filterLeads(status, source, search, assignedToId);
        List<Lead> leads = leadRepository.findAll(spec);
        return leads.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private LeadResponse mapToResponse(Lead lead) {
        return new LeadResponse(
                lead.getId(),
                lead.getName(),
                lead.getEmail(),
                lead.getStatus(),
                lead.getSource(),
                lead.getCreatedAt(),
                lead.getUpdatedAt(),
                lead.getAssignedTo() != null ? lead.getAssignedTo().getId() : null,
                lead.getAssignedTo() != null ? lead.getAssignedTo().getName() : null
        );
    }
}
