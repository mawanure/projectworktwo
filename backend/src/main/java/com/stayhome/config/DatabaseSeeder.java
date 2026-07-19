package com.stayhome.config;

import com.stayhome.entity.Category;
import com.stayhome.entity.Product;
import com.stayhome.entity.ProductImage;
import com.stayhome.entity.Role;
import com.stayhome.entity.User;
import com.stayhome.repository.CategoryRepository;
import com.stayhome.repository.ProductRepository;
import com.stayhome.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin user
        if (!userRepository.existsByEmail("admin@gmail.com")) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .phone("01900000000")
                    .address("Dhaka, Bangladesh")
                    .build();
            userRepository.save(admin);
            System.out.println("Seeded Default Admin: admin@gmail.com / admin123");
        }

        // Seed default Customer user
        if (!userRepository.existsByEmail("customer@stayhome.com")) {
            User customer = User.builder()
                    .name("Default Customer")
                    .email("customer@stayhome.com")
                    .password(passwordEncoder.encode("customer123456"))
                    .role(Role.CUSTOMER)
                    .phone("01800000000")
                    .address("Chatogram, Bangladesh")
                    .build();
            userRepository.save(customer);
            System.out.println("Seeded Default Customer: customer@stayhome.com / customer123456");
        }

        // Seed initial categories
        if (categoryRepository.count() == 0) {
            Category tshirts = Category.builder().name("T-Shirts").description("Trendy and cotton printed T-Shirts").build();
            Category shirts = Category.builder().name("Shirts").description("Formal and casual shirts for men").build();
            Category footwear = Category.builder().name("Footwear").description("Sneakers, formal shoes, and sandals").build();
            Category accessories = Category.builder().name("Accessories").description("Watches, bags, and belts").build();

            categoryRepository.saveAll(Arrays.asList(tshirts, shirts, footwear, accessories));
            System.out.println("Seeded 4 initial categories.");
        }

        // Seed initial products (Check independently!)
        if (productRepository.count() == 0) {
            Category catTshirts = categoryRepository.findByName("T-Shirts").orElse(null);
            Category catShirts = categoryRepository.findByName("Shirts").orElse(null);
            Category catAccessories = categoryRepository.findByName("Accessories").orElse(null);

            if (catTshirts != null && catShirts != null && catAccessories != null) {
                // Product 1
                Product prod1 = Product.builder()
                        .category(catTshirts)
                        .name("Cartoon Print Cotton T-Shirt")
                        .description("Premium cotton printed t-shirt with cool graphic designs.")
                        .price(BigDecimal.valueOf(15.99))
                        .stock(100)
                        .sizes("S,M,L,XL")
                        .isFeatured(true)
                        .isNewArrival(false)
                        .build();
                prod1.setImages(new ArrayList<>(Arrays.asList(
                        ProductImage.builder().product(prod1).imageUrl("images/products/f1.jpg").isPrimary(true).build(),
                        ProductImage.builder().product(prod1).imageUrl("images/products/f2.jpg").isPrimary(false).build()
                )));

                // Product 2
                Product prod2 = Product.builder()
                        .category(catTshirts)
                        .name("Vintage Summer T-Shirt")
                        .description("Lightweight vintage styled summer wear shirt.")
                        .price(BigDecimal.valueOf(18.50))
                        .stock(120)
                        .sizes("M,L,XL")
                        .isFeatured(false)
                        .isNewArrival(true)
                        .build();
                prod2.setImages(new ArrayList<>(Arrays.asList(
                        ProductImage.builder().product(prod2).imageUrl("images/products/f3.jpg").isPrimary(true).build()
                )));

                // Product 3
                Product prod3 = Product.builder()
                        .category(catShirts)
                        .name("Oxford Formal Cotton Shirt")
                        .description("Perfect fit formal oxford shirt for office meetings and ceremonies.")
                        .price(BigDecimal.valueOf(29.99))
                        .stock(80)
                        .sizes("M,L,XL,XXL")
                        .isFeatured(true)
                        .isNewArrival(true)
                        .build();
                prod3.setImages(new ArrayList<>(Arrays.asList(
                        ProductImage.builder().product(prod3).imageUrl("images/products/f4.jpg").isPrimary(true).build()
                )));

                // Product 4
                Product prod4 = Product.builder()
                        .category(catAccessories)
                        .name("Classic Leather Men's Belt")
                        .description("Durable formal brown leather belt with metal buckles.")
                        .price(BigDecimal.valueOf(12.00))
                        .stock(200)
                        .sizes("32,34,36")
                        .isFeatured(false)
                        .isNewArrival(false)
                        .build();
                prod4.setImages(new ArrayList<>(Arrays.asList(
                        ProductImage.builder().product(prod4).imageUrl("images/products/f5.jpg").isPrimary(true).build()
                )));

                productRepository.saveAll(Arrays.asList(prod1, prod2, prod3, prod4));
                System.out.println("Seeded 4 initial products with images.");
            }
        }
    }
}
