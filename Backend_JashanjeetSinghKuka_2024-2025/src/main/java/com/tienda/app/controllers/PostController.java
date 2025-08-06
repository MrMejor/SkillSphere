package com.tienda.app.controllers;

import com.tienda.app.dtos.auth.AddPostRequest;
import com.tienda.app.dtos.auth.GetPostRequest;
import com.tienda.app.enums.Currency;
import com.tienda.app.repositories.UserPurchaseRepository;
import com.tienda.app.services.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/posts")
@CrossOrigin("*")
public class PostController {

  private final PostService postService;
  private final UserPurchaseRepository userPurchaseRepository;

  public PostController(PostService postService , UserPurchaseRepository userPurchaseRepository ) {
    this.postService = postService;
    this.userPurchaseRepository = userPurchaseRepository;
  }

  // Add a new post
  @PostMapping("/create")
  public ResponseEntity<String> addPost(@RequestBody AddPostRequest request) {
    if (request.getImage() == null || request.getImage().isEmpty()) {
//    if (request.getImage() == null || request.getImage().length == 0)  {
      request.setImage(null);
    }
    if (request.getPrice() == null) {
      request.setPrice(BigDecimal.ZERO);
    }
    if (request.getCurrency() == null) {
      request.setCurrency(Currency.EUR);
    }
    postService.savePost(request);
    return ResponseEntity.ok("Post added successfully");
  }

  // Get posts by user with logged-in user info
  @GetMapping("/users/{username}")
  public ResponseEntity<List<GetPostRequest>> getPostsByUser(
      @PathVariable String username,
      @RequestParam(required = false) String loggedInUsername) {
    List<GetPostRequest> posts = postService.getPostsByUser(username, loggedInUsername);
    return ResponseEntity.ok(posts);
  }

  // Get all posts with logged-in user info
  @GetMapping
  public ResponseEntity<List<GetPostRequest>> getAllPosts(
      @RequestParam(required = false) String loggedInUsername) {
    List<GetPostRequest> posts = postService.getAllPosts(loggedInUsername);
    return ResponseEntity.ok(posts);
  }

  // Get post by id with liked info
  @GetMapping("/{id}")
  public ResponseEntity<GetPostRequest> getPostById(
      @PathVariable Long id,
      @RequestParam(required = false) String loggedInUsername) {
    GetPostRequest post = postService.getPostById(id, loggedInUsername);
    return ResponseEntity.ok(post);
  }

  // Delete a post by ID
  @DeleteMapping("/{id}")
  public ResponseEntity<String> deletePostById(@PathVariable Long id) {
    try {
      postService.deletePostById(id);
      return ResponseEntity.ok("Post deleted successfully");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Failed to delete post: " + e.getMessage());
    }
  }

  @GetMapping("/{id}/image")
  public ResponseEntity<String> getPostImage(@PathVariable Long id) {
    try {
      byte[] imageBytes = postService.getPostImage(id);
      if (imageBytes == null || imageBytes.length == 0) {
        return ResponseEntity.notFound().build();
      }
      return ResponseEntity.ok(Base64.getEncoder().encodeToString(imageBytes));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping("/purchases/check")
  public ResponseEntity<Map<String, Boolean>> hasUserPurchased(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestParam Long postId
  ) {
    String username = userDetails.getUsername();
    boolean alreadyPurchased = userPurchaseRepository.existsByUsernameAndPostId(username, postId);
    return ResponseEntity.ok( Collections.singletonMap("purchased", alreadyPurchased));
  }

}
