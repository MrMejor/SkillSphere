package com.tienda.app.dtos.auth;

public class LikeDTO {
  private Long postId;
//  private Long userId;
private String username;

  // Getters and setters
  public Long getPostId() {
    return postId;
  }

  public void setPostId(Long postId) {
    this.postId = postId;
  }

//  public Long getUserId() {
//    return userId;
//  }
//
//  public void setUserId(Long userId) {
//    this.userId = userId;
//  }

  public String getUsername()
  {
    return username;
  }
  public void setUsername( String username )
  {
    this.username = username;
  }
}
