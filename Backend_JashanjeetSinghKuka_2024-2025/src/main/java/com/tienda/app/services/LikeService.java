package com.tienda.app.services;

import com.tienda.app.dtos.auth.LikeDTO;
import com.tienda.app.models.Like;
import com.tienda.app.models.Post;
import com.tienda.app.models.User;
import com.tienda.app.repositories.LikeRepository;
import com.tienda.app.repositories.PostRepository;
import com.tienda.app.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class LikeService {
  private final LikeRepository likeRepository;
  private final PostRepository postRepository;
  private final UserRepository userRepository;

  public LikeService(LikeRepository likeRepository,
      PostRepository postRepository,
      UserRepository userRepository) {
    this.likeRepository = likeRepository;
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

//  @Transactional
//  public void toggleLike(LikeDTO likeDTO) {
//    Post post = postRepository.findById(likeDTO.getPostId())
//        .orElseThrow(() -> new IllegalArgumentException("Post not found"));
//
//    User user = userRepository.findById(likeDTO.getUserId())
//        .orElseThrow(() -> new IllegalArgumentException("User not found"));
//
//    likeRepository.findByPostAndUser(post, user).ifPresentOrElse(
//        like -> likeRepository.delete(like), // Unlike if exists
//        () -> { // Like if doesn't exist
//          Like newLike = new Like();
//          newLike.setPost(post);
//          newLike.setUser(user);
//          likeRepository.save(newLike);
//        }
//    );
//  }

//  @Transactional
//  public void toggleLike(Long postId, String username) {
//    Post post = postRepository.findById(postId)
//        .orElseThrow(() -> new RuntimeException("Post not found"));
//
//    User user = userRepository.findByUsername(username)
//        .orElseThrow(() -> new RuntimeException("User not found"));
//
//    likeRepository.findByPostAndUser(post, user).ifPresentOrElse(
//        like -> likeRepository.delete(like),
//        () -> {
//          Like newLike = new Like();
//          newLike.setPost(post);
//          newLike.setUser(user);
//          likeRepository.save(newLike);
//        }
//    );
//  }

  @Transactional
  public void toggleLike(Long postId, String username) {
    try {
      Post post = postRepository.findById(postId)
          .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

      User user = userRepository.findByUsername(username)
          .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

      Optional<Like> existingLike = likeRepository.findByPostAndUser(post, user);

      if (existingLike.isPresent()) {
        likeRepository.delete(existingLike.get());
        likeRepository.flush(); // Force immediate delete
      } else {
        Like newLike = new Like();
        newLike.setPost(post);
        newLike.setUser(user);
        likeRepository.saveAndFlush(newLike); // Force immediate save
      }
    } catch (Exception e) {
      throw new RuntimeException("Error toggling like: " + e.getMessage(), e);
    }
  }

  public int getLikeCount(Long postId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("Post not found"));
    return likeRepository.countByPost(post);
  }

//  public boolean isLikedByUser(Long postId, Long userId) {
//    Post post = postRepository.findById(postId)
//        .orElseThrow(() -> new IllegalArgumentException("Post not found"));
//
////    User user = userRepository.findById(userId)
////        .orElseThrow(() -> new IllegalArgumentException("User not found"));
//    User user = userRepository.findById(userId)
//        .orElseThrow(() -> new IllegalArgumentException("User not found"));
//
//    return likeRepository.existsByPostAndUser(post, user);
//  }

  public boolean isLikedByUser(Long postId, String username) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("Post not found"));

    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    return likeRepository.existsByPostAndUser(post, user);
  }

}
