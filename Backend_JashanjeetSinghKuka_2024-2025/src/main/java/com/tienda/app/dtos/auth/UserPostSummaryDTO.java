/**
 * Author: jashanjeetsingh
 * Created on 26/5/25 at 11:10
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.dtos.auth;

public class UserPostSummaryDTO {
  private String fullName;
  private String username;
  private long postCount;
  private String role;

  public UserPostSummaryDTO(String fullName, String username, long postCount , String role ) {
    this.fullName = fullName;
    this.username = username;
    this.postCount = postCount;
    this.role = role;
  }

  // Getters and Setters

  public String getFullName()
  {
    return fullName;
  }
  public void setFullName( String fullName )
  {
    this.fullName = fullName;
  }
  public String getUsername()
  {
    return username;
  }
  public void setUsername( String username )
  {
    this.username = username;
  }
  public long getPostCount()
  {
    return postCount;
  }
  public void setPostCount( long postCount )
  {
    this.postCount = postCount;
  }
  public String getRole()
  {
    return role;
  }
  public void setRole( String role )
  {
    this.role = role;
  }
}



