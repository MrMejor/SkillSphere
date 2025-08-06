package com.tienda.app.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.tienda.app.dtos.auth.PaymentRequest;
import com.tienda.app.models.Post;
import com.tienda.app.models.User;
import com.tienda.app.repositories.PostRepository;
import com.tienda.app.repositories.UserRepository;
import com.tienda.app.services.PurchaseService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api")
public class PaymentController {

  private final PurchaseService purchaseService;

  private static final Logger logger = LoggerFactory.getLogger(PurchaseService.class);


  public PaymentController(PurchaseService purchaseService) {
    this.purchaseService = purchaseService;
  }

  @Value("${stripe.secret.key}")
  private String stripeSecretKey;

  @PostConstruct
  public void init() {
    Stripe.apiKey = stripeSecretKey;
  }

  @Value("${stripe.webhook.secret}")
  private String webhookSecret;


  @PostMapping("/create-checkout-session")
  public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody PaymentRequest request) throws StripeException {
    String userRole = request.getUserRole(); // e.g., "Student" or "Teacher"
    String successUrl = "http://localhost:4200/" + userRole.toLowerCase() + "/skillSphere";
//    String cancelUrl = "http://localhost:4200/cancel";
    String cancelUrl = "http://localhost:4200/" + userRole.toLowerCase() + "/skillSphere";

    List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
    lineItems.add(
        SessionCreateParams.LineItem.builder()
            .setPriceData(
                SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency("eur")
                    .setUnitAmount((long) request.getAmount()) // 1000 = $10
                    .setProductData(
                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(request.getProductName())
                            .build()
                    )
                    .build()
            )
            .setQuantity(1L)
            .build()
    );

    SessionCreateParams params = SessionCreateParams.builder()
        .setMode(SessionCreateParams.Mode.PAYMENT)
        .setSuccessUrl(successUrl)
//        .setCancelUrl("http://localhost:4200/cancel")
        .setCancelUrl(cancelUrl)
        .addAllLineItem(lineItems)
//        .putMetadata("userId", String.valueOf(request.getUsername()))
        .putMetadata("username", request.getUsername())
        .putMetadata("postId", String.valueOf(request.getPostId()))
        .build();

    Session session = Session.create(params);
    Map<String, String> responseData = new HashMap<>();
    responseData.put("id", session.getId());

    return ResponseEntity.ok(responseData);
  }

  @RestController
  @RequestMapping("/api/stripe")
  public class StripeWebhookController {

    private final PurchaseService purchaseService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    public StripeWebhookController(PurchaseService purchaseService, UserRepository userRepository, PostRepository postRepository) {
      this.purchaseService = purchaseService;
      this.userRepository = userRepository;
      this.postRepository = postRepository;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
      Event event;
      try {
        event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
      } catch (SignatureVerificationException e) {
        logger.error("Webhook signature verification failed", e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
      }

      if ("checkout.session.completed".equals(event.getType())) {
        logger.info("Received checkout.session.completed");

        try {
          // Use Jackson to parse the payload JSON manually
          ObjectMapper objectMapper = new ObjectMapper();
          JsonNode rootNode = objectMapper.readTree(payload);
          JsonNode sessionNode = rootNode.path("data").path("object");

          String username = sessionNode.path("metadata").path("username").asText(null);
          String postIdStr = sessionNode.path("metadata").path("postId").asText(null);

          if (username == null || postIdStr == null) {
            logger.warn("Missing metadata fields in webhook");
            return ResponseEntity.ok("Missing metadata");
          }

          logger.info("Parsed from JSON → username: {}, postId: {}", username, postIdStr);

          User user = userRepository.findByUsername(username).orElse(null);
          Long postId = Long.parseLong(postIdStr);
          Post post = postRepository.findById(postId).orElse(null);

          if (user != null && post != null) {
            purchaseService.savePurchase(user, post);
            logger.info("Purchase saved for user {} and post {}", username, postId);
          } else {
            logger.warn("User or Post not found. User: {}, Post: {}", user, post);
          }

        } catch (Exception e) {
          logger.error("Error parsing webhook payload", e);
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook processing error");
        }
      }

      return ResponseEntity.ok("");
    }


  }

}
