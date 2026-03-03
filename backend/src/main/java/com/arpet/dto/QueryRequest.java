package com.arpet.dto;

import javax.validation.constraints.NotBlank;

public class QueryRequest {
    @NotBlank(message = "targetId不能为空")
    private String targetId;

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }
}
