package com.stayhome.service;

import com.stayhome.dto.CategoryResponse;
import com.stayhome.dto.ProductRequest;
import com.stayhome.dto.ProductResponse;
import com.stayhome.dto.ProductSummaryResponse;
import com.stayhome.entity.Category;
import com.stayhome.entity.Product;
import com.stayhome.entity.ProductImage;
import com.stayhome.exception.ResourceNotFoundException;
import com.stayhome.repository.CategoryRepository;
import com.stayhome.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<ProductSummaryResponse> getAllProducts() {
        return productRepository.findByIsActiveTrue().stream()
                .map(this::mapToProductSummaryResponse)
                .collect(Collectors.toList());
    }

    public Page<ProductSummaryResponse> searchProducts(String search, Long categoryId, Pageable pageable) {
        Page<Product> products = productRepository.searchActiveProducts(search, categoryId, pageable);
        return products.map(this::mapToProductSummaryResponse);
    }

    public Page<ProductResponse> searchProductsForAdmin(String search, Long categoryId, Pageable pageable) {
        return productRepository.searchProducts(search, categoryId, pageable).map(this::mapToProductResponse);
    }

    public ProductResponse getProductByIdForAdmin(Long id) {
        return productRepository.findById(id).map(this::mapToProductResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<ProductSummaryResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue().stream()
                .map(this::mapToProductSummaryResponse)
                .collect(Collectors.toList());
    }

    public List<ProductSummaryResponse> getNewArrivals() {
        return productRepository.findByIsNewArrivalTrueAndIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToProductSummaryResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToProductResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .sizes(request.getSizes())
                .isActive(true)
                .build();

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(ProductImage.builder()
                        .product(product)
                        .imageUrl(request.getImageUrls().get(i))
                        .isPrimary(i == 0)
                        .build());
            }
            product.setImages(images);
        }

        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setCategory(category);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setSizes(request.getSizes());

        // Update product images
        product.getImages().clear();
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                product.getImages().add(ProductImage.builder()
                        .product(product)
                        .imageUrl(request.getImageUrls().get(i))
                        .isPrimary(i == 0)
                        .build());
            }
        }

        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<ProductSummaryResponse> getRelatedProducts(Long productId) {
        Product product = productRepository.findByIdAndIsActiveTrue(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        return productRepository.findTop4ByCategoryIdAndIdNotAndIsActiveTrue(product.getCategory().getId(), productId).stream()
                .map(this::mapToProductSummaryResponse)
                .collect(Collectors.toList());
    }

    private ProductSummaryResponse mapToProductSummaryResponse(Product product) {
        String primaryImageUrl = null;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            primaryImageUrl = product.getImages().stream()
                    .filter(ProductImage::getIsPrimary)
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(product.getImages().get(0).getImageUrl());
        }

        return ProductSummaryResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .primaryImageUrl(primaryImageUrl)
                .build();
    }

    private ProductResponse mapToProductResponse(Product product) {
        List<String> imageUrls = new ArrayList<>();
        if (product.getImages() != null) {
            imageUrls = product.getImages().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
        }

        CategoryResponse categoryResponse = CategoryResponse.builder()
                .id(product.getCategory().getId())
                .name(product.getCategory().getName())
                .description(product.getCategory().getDescription())
                .build();

        String availability = (product.getStock() != null && product.getStock() > 0) ? "In Stock" : "Out of Stock";

        return ProductResponse.builder()
                .id(product.getId())
                .category(categoryResponse)
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .sizes(product.getSizes())
                .rating(product.getRating())
                .availability(availability)
                .isActive(product.getIsActive())
                .imageUrls(imageUrls)
                .build();
    }
}
