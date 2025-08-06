/**
 * Author: jashanjeetsingh
 * Created on 23/5/25 at 02:57
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.models;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_courses")
public class UserPurchase {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // Many UserCourses can belong to one User
//  @ManyToOne(fetch = FetchType.LAZY)
  @Column(name = "username", nullable = false, length = 100)
  private String username;
//  private User user;

  // Many UserCourses can belong to one Course
  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
  @JoinColumn(name = "post_id", nullable = false)
  private Post post;

  @Column(name = "purchase_date")
  private LocalDateTime purchaseDate;

  @Column(name = "payment_status", length = 20)
  private String paymentStatus;

  // Constructors, getters and setters

  public UserPurchase() {
    this.purchaseDate = LocalDateTime.now();
    this.paymentStatus = "completed";
  }

  // Getters and Setters

  public Long getId()
  {
    return id;
  }
  public void setId( Long id )
  {
    this.id = id;
  }
  public String getUsername()
  {
    return username;
  }
  public void setUsername( String username )
  {
    this.username = username;
  }
  public Post getPost()
  {
    return post;
  }
  public void setPost( Post post )
  {
    this.post = post;
  }
  public LocalDateTime getPurchaseDate()
  {
    return purchaseDate;
  }
  public void setPurchaseDate( LocalDateTime purchaseDate )
  {
    this.purchaseDate = purchaseDate;
  }
  public String getPaymentStatus()
  {
    return paymentStatus;
  }
  public void setPaymentStatus( String paymentStatus )
  {
    this.paymentStatus = paymentStatus;
  }
}


