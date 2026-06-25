package com.smartleads.dto.response;

import java.time.LocalDateTime;

import com.smartleads.enums.LeadSource;
import com.smartleads.enums.LeadStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeadResponse {

    public LeadResponse(Long id, String name, String email, LeadStatus status, LeadSource source,
            LocalDateTime createdAt, LocalDateTime updatedAt, Long assignedToId, String assignedToName) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.status = status;
        this.source = source;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.assignedToId = assignedToId;
        this.assignedToName = assignedToName;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public LeadStatus getStatus() {
        return status;
    }

    public LeadSource getSource() {
        return source;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public String getAssignedToName() {
        return assignedToName;
    }

    private Long id;
    private String name;
    private String email;
    private LeadStatus status;
    private LeadSource source;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long assignedToId;
    private String assignedToName;
}
