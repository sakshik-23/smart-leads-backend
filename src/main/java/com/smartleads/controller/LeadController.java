package com.smartleads.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.smartleads.dto.request.LeadRequest;
import com.smartleads.dto.response.LeadResponse;
import com.smartleads.dto.response.PagedLeadResponse;
import com.smartleads.entity.User;
import com.smartleads.enums.LeadSource;
import com.smartleads.enums.LeadStatus;
import com.smartleads.enums.Role;
import com.smartleads.exception.ResourceNotFoundException;
import com.smartleads.repository.UserRepository;
import com.smartleads.service.LeadService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadService leadService;
    private final UserRepository userRepository;

    public LeadController(LeadService leadService, UserRepository userRepository) {
        this.leadService = leadService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LeadResponse createLead(
            @Valid @RequestBody LeadRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getCurrentUser(userDetails);
        
        // If creator is SALES, automatically assign to themselves
        if (user.getRole() == Role.SALES) {
            request.setAssignedToId(user.getId());
        }
        
        return leadService.createLead(request);
    }

    @PutMapping("/{id}")
    public LeadResponse updateLead(
            @PathVariable Long id,
            @Valid @RequestBody LeadRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getCurrentUser(userDetails);
        LeadResponse existingLead = leadService.getLeadById(id);

        // Check permission: SALES users can only update their own leads
        if (user.getRole() == Role.SALES) {
            if (existingLead.getAssignedToId() == null || !existingLead.getAssignedToId().equals(user.getId())) {
                throw new AccessDeniedException("You do not have permission to update this lead");
            }
            // Enforce that a SALES user cannot reassign the lead to someone else
            request.setAssignedToId(user.getId());
        }

        return leadService.updateLead(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
    }

    @GetMapping("/{id}")
    public LeadResponse getLeadById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getCurrentUser(userDetails);
        LeadResponse lead = leadService.getLeadById(id);

        // Check permission: SALES users can only view their own leads
        if (user.getRole() == Role.SALES) {
            if (lead.getAssignedToId() == null || !lead.getAssignedToId().equals(user.getId())) {
                throw new AccessDeniedException("You do not have permission to view this lead");
            }
        }

        return lead;
    }

    @GetMapping
    public PagedLeadResponse getAllLeads(
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(required = false) LeadSource source,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getCurrentUser(userDetails);

        // Enforce that SALES users can only fetch leads assigned to them
        if (user.getRole() == Role.SALES) {
            assignedToId = user.getId();
        }

        return leadService.getAllLeads(status, source, search, assignedToId, page, size, sortBy, sortDir);
    }

    @GetMapping("/export")
    public void exportLeadsToCSV(
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(required = false) LeadSource source,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long assignedToId,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletResponse response
    ) throws IOException {
        User user = getCurrentUser(userDetails);

        // Enforce that SALES users can only export leads assigned to them
        if (user.getRole() == Role.SALES) {
            assignedToId = user.getId();
        }

        List<LeadResponse> leads = leadService.getLeadsListForExport(status, source, search, assignedToId);

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"leads.csv\"");

        PrintWriter writer = response.getWriter();
        writer.println("ID,Name,Email,Status,Source,Created At,Assigned To");

        for (LeadResponse lead : leads) {
            writer.println(String.format("%d,\"%s\",\"%s\",%s,%s,\"%s\",\"%s\"",
                    lead.getId(),
                    lead.getName().replace("\"", "\"\""),
                    lead.getEmail().replace("\"", "\"\""),
                    lead.getStatus(),
                    lead.getSource(),
                    lead.getCreatedAt(),
                    lead.getAssignedToName() != null ? lead.getAssignedToName().replace("\"", "\"\"") : "Unassigned"
            ));
        }
        writer.flush();
    }

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Logged in user not found"));
    }
}
