package com.arpet.dto;

public class UploadResponse {
    private String targetId;
    private String cartoonUrl;
    private String resourceType;

    public UploadResponse() {
    }

    public UploadResponse(String targetId, String cartoonUrl, String resourceType) {
        this.targetId = targetId;
        this.cartoonUrl = cartoonUrl;
        this.resourceType = resourceType;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getCartoonUrl() {
        return cartoonUrl;
    }

    public void setCartoonUrl(String cartoonUrl) {
        this.cartoonUrl = cartoonUrl;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }
}
