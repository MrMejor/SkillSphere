/**
 * Author: jashanjeetsingh
 * Created on 17/5/25 at 23:05
 * What we did in this class :-
 */
package com.tienda.app.repositories;
import com.tienda.app.models.Comment;
import com.tienda.app.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
public interface CommentRepository extends JpaRepository< Comment, Long>
{
  List<Comment> findByPostOrderByCreatedAtDesc( Post post);

  @Transactional
  @Modifying
  @Query("DELETE FROM Comment c WHERE c.user.id = :userId")
  void deleteAllByUserId(Long userId);
}
