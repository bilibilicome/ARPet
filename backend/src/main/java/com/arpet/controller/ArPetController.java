package com.arpet.controller;

import com.arpet.config.ArPetConfig;
import com.arpet.dto.ApiResponse;
import com.arpet.dto.QueryRequest;
import com.arpet.dto.QueryResponse;
import com.arpet.dto.UploadResponse;
import com.arpet.service.CartoonService;
import com.arpet.service.FileStorageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;

@RestController
public class ArPetController {

    private final FileStorageService fileStorageService;
    private final CartoonService cartoonService;
    private final ArPetConfig arPetConfig;

    public ArPetController(FileStorageService fileStorageService, CartoonService cartoonService, ArPetConfig arPetConfig) {
        this.fileStorageService = fileStorageService;
        this.cartoonService = cartoonService;
        this.arPetConfig = arPetConfig;
    }

    @PostMapping("/upload")
    public ApiResponse<UploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ApiResponse.error(400, "文件不能为空");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ApiResponse.error(400, "只支持图片文件");
            }

            String originalFilename = fileStorageService.storeFile(
                file, 
                arPetConfig.getFile().getUploadPath()
            );

            String cartoonFilename = cartoonService.generateCartoonImage(originalFilename);
            String targetId = fileStorageService.generateTargetId();
            String cartoonUrl = fileStorageService.getFileUrl(cartoonFilename, "cartoon");

            fileStorageService.saveCartoonMapping(targetId, cartoonUrl, "image");

            UploadResponse response = new UploadResponse(targetId, cartoonUrl, "image");
            return ApiResponse.success("上传成功", response);

        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("上传失败: " + e.getMessage());
        }
    }

    @PostMapping("/query")
    public ApiResponse<QueryResponse> queryCartoon(@Valid @RequestBody QueryRequest request) {
        try {
            String cartoonUrl = fileStorageService.getCartoonUrl(request.getTargetId());
            
            if (cartoonUrl == null) {
                return ApiResponse.error(404, "未找到对应的卡通形象");
            }

            String resourceType = fileStorageService.getResourceType(request.getTargetId());
            QueryResponse response = new QueryResponse(cartoonUrl, resourceType);
            
            return ApiResponse.success(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.success("服务运行正常");
    }
}
