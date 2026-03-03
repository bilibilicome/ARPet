package com.arpet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotBlank;

@Configuration
@ConfigurationProperties(prefix = "arpet")
@Validated
public class ArPetConfig {

    private FileConfig file = new FileConfig();
    private ServerConfig server = new ServerConfig();

    public FileConfig getFile() {
        return file;
    }

    public void setFile(FileConfig file) {
        this.file = file;
    }

    public ServerConfig getServer() {
        return server;
    }

    public void setServer(ServerConfig server) {
        this.server = server;
    }

    public static class FileConfig {
        @NotBlank(message = "上传路径不能为空")
        private String uploadPath = "src/main/resources/static/uploads";
        @NotBlank(message = "卡通路径不能为空")
        private String cartoonPath = "src/main/resources/static/cartoons";

        public String getUploadPath() {
            return uploadPath;
        }

        public void setUploadPath(String uploadPath) {
            this.uploadPath = uploadPath;
        }

        public String getCartoonPath() {
            return cartoonPath;
        }

        public void setCartoonPath(String cartoonPath) {
            this.cartoonPath = cartoonPath;
        }
    }

    public static class ServerConfig {
        @NotBlank(message = "服务器基础URL不能为空")
        private String baseUrl = "http://localhost:8080/api";

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }
    }
}
