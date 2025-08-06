package com.tienda.app.repositories;

import com.tienda.app.models.Post;
import com.tienda.app.models.UserPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPurchaseRepository extends JpaRepository< UserPurchase, Long> {

//    boolean existsByUserIdAndPostIdAndPaymentStatus(Long userId, Long postId, String paymentStatus);
    boolean existsByUsernameAndPostIdAndPaymentStatus(String username, Long postId, String paymentStatus);
    boolean existsByUsernameAndPost(String username, Post post);
    boolean existsByUsernameAndPostId(String username, Long postId);
    // In UserPurchaseRepository
    @Query("SELECT up.post FROM UserPurchase up WHERE up.username = :username")
    List<Post> findPostsByUsername(@Param("username") String username);

    void deleteByPostId(Long postId);
}
