package com.stayhome.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/upload")
@PreAuthorize("hasRole('ADMIN')")
public class ImageUploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base-url:}")
    private String baseUrl;

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Only image files (JPEG, PNG, WebP, GIF) are allowed"
            ));
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "File size must be less than 5MB"
            ));
        }

        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        // Generate a unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Save the file
        Path targetLocation = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Build the public URL
        String imageUrl = "/uploads/" + uniqueFilename;

        return ResponseEntity.ok(Map.of("url", imageUrl));
    }
}
