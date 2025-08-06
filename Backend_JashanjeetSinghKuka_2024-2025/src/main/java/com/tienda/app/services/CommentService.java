package com.tienda.app.services;

import com.tienda.app.dtos.auth.CommentDTO;
import com.tienda.app.models.Comment;
import com.tienda.app.models.Post;
import com.tienda.app.models.User;
import com.tienda.app.repositories.CommentRepository;
import com.tienda.app.repositories.PostRepository;
import com.tienda.app.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

  private final CommentRepository commentRepository;
  private final PostRepository postRepository;
  private final UserRepository userRepository;

  public CommentService(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository) {
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  public List<CommentDTO> getCommentsByPost(Long postId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new RuntimeException("Post not found"));

    List<Comment> comments = commentRepository.findByPostOrderByCreatedAtDesc(post);

    return comments.stream().map(this::toDto).collect(Collectors.toList());
  }

//  @Transactional
//  public CommentDTO addComment(Long postId, Long userId, String text) {
//    Post post = postRepository.findById(postId)
//        .orElseThrow(() -> new RuntimeException("Post not found"));
//
//    User user = userRepository.findById(userId)
//        .orElseThrow(() -> new RuntimeException("User not found"));
//
//    Comment comment = new Comment();
//    comment.setPost(post);
//    comment.setUser(user);
//    comment.setText(text);
//
//    Comment saved = commentRepository.save(comment);
//    return toDto(saved);
//  }

  @Transactional
  public CommentDTO addCommentByUsername(Long postId, String username, String text) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new RuntimeException("Post not found"));

    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Comment comment = new Comment();
    comment.setPost(post);
    comment.setUser(user);
    comment.setText(text);

    Comment saved = commentRepository.save(comment);
    return toDto(saved);
  }


  private CommentDTO toDto( Comment comment )
  {
    CommentDTO dto = new CommentDTO();
    dto.setId( comment.getId() );
    dto.setText( comment.getText() );
    dto.setPostId( comment.getPost().getId() );
    dto.setUserId( comment.getUser().getId() );
    dto.setUsername( comment.getUser().getUsername() );
    dto.setCreatedAt( comment.getCreatedAt() );
    return dto;
  }
}
