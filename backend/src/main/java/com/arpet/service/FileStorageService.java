package com.arpet.service;

import com.arpet.config.ArPetConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    private final ArPetConfig arPetConfig;
    private final Map<String, String> targetIdToCartoonUrl = new HashMap<>();
    private final Map<String, String> targetIdToResourceType = new HashMap<>();

    public FileStorageService(ArPetConfig arPetConfig) {
        this.arPetConfig = arPetConfig;
        initDirectories();
    }

    private void initDirectories() {
        try {
            Path uploadPath = Paths.get(arPetConfig.getFile().getUploadPath());
            Path cartoonPath = Paths.get(arPetConfig.getFile().getCartoonPath());
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            if (!Files.exists(cartoonPath)) {
                Files.createDirectories(cartoonPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("初始化目录失败", e);
        }
    }

    public String storeFile(MultipartFile file, String directory) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String randomId = UUID.randomUUID().toString().substring(0, 8);
        String newFilename = timestamp + "_" + randomId + extension;

        Path targetPath = Paths.get(directory, newFilename);
        Files.copy(file.getInputStream(), targetPath);

        return newFilename;
    }

    public String generateTargetId() {
        return "target_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }

    public String getFileUrl(String filename, String type) {
        String baseUrl = arPetConfig.getServer().getBaseUrl();
        String path = type.equals("upload") ? "uploads" : "cartoons";
        return baseUrl + "/" + path + "/" + filename;
    }

    public void saveCartoonMapping(String targetId, String cartoonUrl, String resourceType) {
        targetIdToCartoonUrl.put(targetId, cartoonUrl);
        targetIdToResourceType.put(targetId, resourceType);
    }

    public String getCartoonUrl(String targetId) {
        return targetIdToCartoonUrl.get(targetId);
    }

    public String getResourceType(String targetId) {
        return targetIdToResourceType.getOrDefault(targetId, "image");
    }
}
