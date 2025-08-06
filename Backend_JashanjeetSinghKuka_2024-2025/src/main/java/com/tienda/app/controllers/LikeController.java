package com.tienda.app.controllers;

import com.tienda.app.dtos.auth.LikeDTO;
import com.tienda.app.services.LikeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
public class LikeController {
  private final LikeService likeService;

  public LikeController(LikeService likeService) {
    this.likeService = likeService;
  }

  @PostMapping
  public ResponseEntity<?> toggleLike(@RequestBody LikeDTO likeDTO) {
    likeService.toggleLike(likeDTO.getPostId(), likeDTO.getUsername());
    return ResponseEntity.ok().build();
  }

  @GetMapping("/count/{postId}")
  public ResponseEntity<?> getLikeCount(@PathVariable Long postId) {
    try {
      return ResponseEntity.ok(likeService.getLikeCount(postId));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error getting like count");
    }
  }

  @GetMapping("/status")
  public ResponseEntity<?> checkLikeStatus(
      @RequestParam Long postId,
      @RequestParam String username) {
    try {
      boolean isLiked = likeService.isLikedByUser(postId, username);
      return ResponseEntity.ok(isLiked);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking like status");
    }
  }

  @GetMapping("/check/{postId}/{username}")
  public ResponseEntity<Boolean> checkIfLiked(@PathVariable Long postId, @PathVariable String username) {
    boolean liked = likeService.isLikedByUser(postId, username);
    return ResponseEntity.ok(liked);
  }

}
