package com.tienda.app.repositories;

import com.tienda.app.models.Like;
import com.tienda.app.models.Post;
import com.tienda.app.models.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
  Optional<Like> findByPostAndUser(Post post, User user);
  int countByPost(Post post);
  boolean existsByPostAndUser(Post post, User user);

  @Transactional
  void deleteAllByUser(User user);

}
