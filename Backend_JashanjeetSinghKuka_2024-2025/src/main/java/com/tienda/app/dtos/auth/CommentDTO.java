/**
 * Author: jashanjeetsingh
 * Created on 17/5/25 at 23:07
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.dtos.auth;
import java.time.LocalDateTime;
public class CommentDTO
{
  private Long id;
  private String text;
  private Long postId;
  private Long userId;
  private String username;
  private LocalDateTime createdAt;
  // Getters and setters

  public Long getId()
  {
    return id;
  }
  public void setId( Long id )
  {
    this.id = id;
  }
  public String getText()
  {
    return text;
  }
  public void setText( String text )
  {
    this.text = text;
  }
  public String getUsername()
  {
    return username;
  }
  public void setUsername( String username )
  {
    this.username = username;
  }
  public LocalDateTime getCreatedAt()
  {
    return createdAt;
  }
  public void setCreatedAt( LocalDateTime createdAt )
  {
    this.createdAt = createdAt;
  }
  public Long getPostId()
  {
    return postId;
  }
  public void setPostId( Long postId )
  {
    this.postId = postId;
  }
  public Long getUserId()
  {
    return userId;
  }
  public void setUserId( Long userId )
  {
    this.userId = userId;
  }
}


