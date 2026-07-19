package com.stayhome.controller;

import com.stayhome.dto.ProductRequest;
import com.stayhome.dto.ProductResponse;
import com.stayhome.dto.ProductSummaryResponse;
import com.stayhome.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    // --- Public APIs ---

    @GetMapping("/api/products")
    public ResponseEntity<Page<ProductSummaryResponse>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        Sort sorting = Sort.unsorted();
        if (sort != null && sort.contains(",")) {
            String[] sortParams = sort.split(",");
            String property = sortParams[0];
            String direction = sortParams[1];
            if ("desc".equalsIgnoreCase(direction)) {
                sorting = Sort.by(property).descending();
            } else {
                sorting = Sort.by(property).ascending();
            }
        }
        Pageable pageable = PageRequest.of(page, size, sorting);
        Page<ProductSummaryResponse> products = productService.searchProducts(search, categoryId, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/api/products/featured")
    public ResponseEntity<List<ProductSummaryResponse>> getFeaturedProducts() {
        List<ProductSummaryResponse> featured = productService.getFeaturedProducts();
        return ResponseEntity.ok(featured);
    }

    @GetMapping("/api/products/new-arrivals")
    public ResponseEntity<List<ProductSummaryResponse>> getNewArrivals() {
        List<ProductSummaryResponse> newArrivals = productService.getNewArrivals();
        return ResponseEntity.ok(newArrivals);
    }

    @GetMapping("/api/products/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/api/products/{id}/related")
    public ResponseEntity<List<ProductSummaryResponse>> getRelatedProducts(@PathVariable Long id) {
        List<ProductSummaryResponse> related = productService.getRelatedProducts(id);
        return ResponseEntity.ok(related);
    }

    @GetMapping("/api/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ProductResponse>> getProductsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("id").descending());
        return ResponseEntity.ok(productService.searchProductsForAdmin(search, categoryId, pageable));
    }

    @GetMapping("/api/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> getProductForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductByIdForAdmin(id));
    }

    // --- Admin APIs ---

    @PostMapping("/api/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @PutMapping("/api/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/api/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
