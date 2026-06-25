package com.smartleads.dto.request;

import com.smartleads.enums.LeadSource;
import com.smartleads.enums.LeadStatus;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeadRequest {

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LeadStatus getStatus() {
        return status;
    }

    public void setStatus(LeadStatus status) {
        this.status = status;
    }

    public LeadSource getSource() {
        return source;
    }

    public void setSource(LeadSource source) {
        this.source = source;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }

    @NotBlank(message = "Lead name is required")
    private String name;

    @NotBlank(message = "Lead email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Lead status is required")
    private LeadStatus status;

    @NotNull(message = "Lead source is required")
    private LeadSource source;

    private Long assignedToId;
}
