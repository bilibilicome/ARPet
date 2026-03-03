package com.arpet.dto;

public class QueryResponse {
    private String cartoonUrl;
    private String resourceType;

    public QueryResponse() {
    }

    public QueryResponse(String cartoonUrl, String resourceType) {
        this.cartoonUrl = cartoonUrl;
        this.resourceType = resourceType;
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
