/**
 * Author: jashanjeetsingh
 * Created on 23/5/25 at 03:05
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.services;
import com.tienda.app.controllers.PaymentController;
import com.tienda.app.models.Post;
import com.tienda.app.models.User;
import com.tienda.app.models.UserPurchase;
import com.tienda.app.repositories.UserPurchaseRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PurchaseService {

  private final UserPurchaseRepository userPurchaseRepository;
  private static final Logger logger = LoggerFactory.getLogger( PaymentController.class);


  public PurchaseService(UserPurchaseRepository userPurchaseRepository) {
    this.userPurchaseRepository = userPurchaseRepository;
  }

//  public boolean userAlreadyOwnsCourse(Long userId, Long postId) {
  public boolean userAlreadyOwnsCourse(String username, Long postId) {
//    return userPurchaseRepository.existsByUserIdAndPostIdAndPaymentStatus(userId, postId, "completed");
    return userPurchaseRepository.existsByUsernameAndPostIdAndPaymentStatus(username, postId, "completed");
  }

  // Save purchase after payment success
//  @Transactional
//  public void savePurchase( User user, Post post) {
//    UserPurchase purchase = new UserPurchase();
//    purchase.setUsername( user.getUsername() );
//    purchase.setPost(post);
//    purchase.setPaymentStatus("completed");
//    purchase.setPurchaseDate( LocalDateTime.now());
//    userPurchaseRepository.save(purchase);
//  }

  @Transactional
  public void savePurchase(User user, Post post) {
    boolean alreadyPurchased = userPurchaseRepository.existsByUsernameAndPost(user.getUsername(), post);

    if (alreadyPurchased) {
      // Log and skip
      LoggerFactory.getLogger(PurchaseService.class).info("Purchase already exists for user {} and post {}", user.getUsername(), post.getId());
      return;
    }

    UserPurchase purchase = new UserPurchase();
    purchase.setUsername(user.getUsername());
    purchase.setPost(post);
    purchase.setPurchaseDate(LocalDateTime.now());
    purchase.setPaymentStatus("PAID");

    userPurchaseRepository.save(purchase);
    LoggerFactory.getLogger(PurchaseService.class).info("Purchase saved for user {} and post {}", user.getUsername(), post.getId());
  }


}



