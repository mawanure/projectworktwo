package com.stayhome.controller;

import com.stayhome.dto.ContactMessageRequest;
import com.stayhome.dto.NewsletterSubscribeRequest;
import com.stayhome.entity.ContactMessage;
import com.stayhome.entity.NewsletterSubscriber;
import com.stayhome.exception.ResourceConflictException;
import com.stayhome.repository.BlogPostRepository;
import com.stayhome.repository.ContactMessageRepository;
import com.stayhome.repository.NewsletterSubscriberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PublicContentControllerTest {

    @Mock private ContactMessageRepository contactMessageRepository;
    @Mock private NewsletterSubscriberRepository newsletterSubscriberRepository;
    @Mock private BlogPostRepository blogPostRepository;
    @InjectMocks private PublicContentController controller;

    @Test
    void savesTrimmedContactMessage() {
        ContactMessage saved = ContactMessage.builder().id(1L).name("Amina").emailOrPhone("amina@example.com")
                .message("Need help").createdAt(LocalDateTime.now()).build();
        when(contactMessageRepository.save(any(ContactMessage.class))).thenReturn(saved);

        var response = controller.submitContactMessage(ContactMessageRequest.builder()
                .name(" Amina ").emailOrPhone(" amina@example.com ").message(" Need help ").build());

        ArgumentCaptor<ContactMessage> captor = ArgumentCaptor.forClass(ContactMessage.class);
        verify(contactMessageRepository).save(captor.capture());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Amina", captor.getValue().getName());
        assertEquals("Need help", response.getBody().getMessage());
    }

    @Test
    void rejectsDuplicateNewsletterSubscription() {
        when(newsletterSubscriberRepository.existsByEmail("amina@example.com")).thenReturn(true);

        assertThrows(ResourceConflictException.class, () -> controller.subscribe(
                NewsletterSubscribeRequest.builder().email(" Amina@Example.com ").build()));
    }

    @Test
    void savesNormalizedNewsletterEmail() {
        NewsletterSubscriber saved = NewsletterSubscriber.builder().id(2L).email("amina@example.com")
                .subscribedAt(LocalDateTime.now()).build();
        when(newsletterSubscriberRepository.save(any(NewsletterSubscriber.class))).thenReturn(saved);

        var response = controller.subscribe(NewsletterSubscribeRequest.builder().email(" Amina@Example.com ").build());

        ArgumentCaptor<NewsletterSubscriber> captor = ArgumentCaptor.forClass(NewsletterSubscriber.class);
        verify(newsletterSubscriberRepository).save(captor.capture());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("amina@example.com", captor.getValue().getEmail());
    }
}
