package com.stayhome.controller;

import com.stayhome.dto.BlogPostResponse;
import com.stayhome.dto.ContactMessageRequest;
import com.stayhome.dto.ContactMessageResponse;
import com.stayhome.dto.NewsletterSubscribeRequest;
import com.stayhome.dto.NewsletterSubscriberResponse;
import com.stayhome.entity.BlogPost;
import com.stayhome.entity.ContactMessage;
import com.stayhome.entity.NewsletterSubscriber;
import com.stayhome.exception.ResourceConflictException;
import com.stayhome.exception.ResourceNotFoundException;
import com.stayhome.repository.BlogPostRepository;
import com.stayhome.repository.ContactMessageRepository;
import com.stayhome.repository.NewsletterSubscriberRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PublicContentController {

    private final ContactMessageRepository contactMessageRepository;
    private final NewsletterSubscriberRepository newsletterSubscriberRepository;
    private final BlogPostRepository blogPostRepository;

    public PublicContentController(ContactMessageRepository contactMessageRepository,
                                   NewsletterSubscriberRepository newsletterSubscriberRepository,
                                   BlogPostRepository blogPostRepository) {
        this.contactMessageRepository = contactMessageRepository;
        this.newsletterSubscriberRepository = newsletterSubscriberRepository;
        this.blogPostRepository = blogPostRepository;
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactMessageResponse> submitContactMessage(@Valid @RequestBody ContactMessageRequest request) {
        ContactMessage message = contactMessageRepository.save(ContactMessage.builder()
                .name(request.getName().trim())
                .emailOrPhone(request.getEmailOrPhone().trim())
                .message(request.getMessage().trim())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(toContactResponse(message));
    }

    @PostMapping("/newsletter/subscribe")
    public ResponseEntity<NewsletterSubscriberResponse> subscribe(@Valid @RequestBody NewsletterSubscribeRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (newsletterSubscriberRepository.existsByEmail(email)) {
            throw new ResourceConflictException("This email is already subscribed.");
        }
        NewsletterSubscriber subscriber = newsletterSubscriberRepository.save(NewsletterSubscriber.builder().email(email).build());
        return ResponseEntity.status(HttpStatus.CREATED).body(toSubscriberResponse(subscriber));
    }

    @GetMapping("/blogs")
    public ResponseEntity<Page<BlogPostResponse>> getBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50));
        return ResponseEntity.ok(blogPostRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toBlogResponse));
    }

    @GetMapping("/blogs/{id}")
    public ResponseEntity<BlogPostResponse> getBlog(@PathVariable Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        return ResponseEntity.ok(toBlogResponse(post));
    }

    private ContactMessageResponse toContactResponse(ContactMessage message) {
        return ContactMessageResponse.builder().id(message.getId()).name(message.getName())
                .emailOrPhone(message.getEmailOrPhone()).message(message.getMessage()).createdAt(message.getCreatedAt()).build();
    }

    private NewsletterSubscriberResponse toSubscriberResponse(NewsletterSubscriber subscriber) {
        return NewsletterSubscriberResponse.builder().id(subscriber.getId()).email(subscriber.getEmail())
                .subscribedAt(subscriber.getSubscribedAt()).build();
    }

    private BlogPostResponse toBlogResponse(BlogPost post) {
        return BlogPostResponse.builder().id(post.getId()).title(post.getTitle()).content(post.getContent())
                .imageUrl(post.getImageUrl()).author(post.getAuthor()).createdAt(post.getCreatedAt()).build();
    }
}
