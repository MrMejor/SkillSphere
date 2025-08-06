/**
 * Author: jashanjeetsingh
 * Created on 22/5/25 at 20:43
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.dtos.auth;
public class PaymentRequest
{
  private String productName;
  private int amount;
  private String userRole;
//  private Long userId;
  private Long postId;
  private String username; // Add this

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }


  public String getProductName()
  {
    return productName;
  }
  public void setProductName( String productName )
  {
    this.productName = productName;
  }
  public int getAmount()
  {
    return amount;
  }
  public void setAmount( int amount )
  {
    this.amount = amount;
  }
  public String getUserRole()
  {
    return userRole;
  }
  public void setUserRole( String userRole )
  {
    this.userRole = userRole;
  }
//  public Long getUserId()
//  {
//    return userId;
//  }
//  public void setUserId( Long userId )
//  {
//    this.userId = userId;
//  }
  public Long getPostId()
  {
    return postId;
  }
  public void setPostId( Long postId )
  {
    this.postId = postId;
  }
}


