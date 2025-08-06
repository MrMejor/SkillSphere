package com.tienda.app.controllers;

import com.tienda.app.dtos.auth.CommentDTO;
import com.tienda.app.services.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

  private final CommentService commentService;

  public CommentController(CommentService commentService) {
    this.commentService = commentService;
  }

  @GetMapping("/post/{postId}")
  public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long postId) {
    return ResponseEntity.ok(commentService.getCommentsByPost(postId));
  }

@PostMapping("/add")
public ResponseEntity<CommentDTO> addCommentByUsername(@RequestBody CommentDTO commentDTO) {
  try {
    CommentDTO savedComment = commentService.addCommentByUsername(
        commentDTO.getPostId(),
        commentDTO.getUsername(),
        commentDTO.getText()
    );
    return ResponseEntity.ok(savedComment);
  } catch (RuntimeException e) {
    return ResponseEntity.badRequest().build();
  }
}
}
