/**
 * Author: jashanjeetsingh
 * Created on 22/5/25 at 01:13
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.dtos.auth;
public class UserProfileUpdateRequest {
  private String firstName;
  private String lastName;
  private String address;

  // Getters and setters

  public String getFirstName()
  {
    return firstName;
  }
  public void setFirstName( String firstName )
  {
    this.firstName = firstName;
  }
  public String getLastName()
  {
    return lastName;
  }
  public void setLastName( String lastName )
  {
    this.lastName = lastName;
  }
  public String getAddress()
  {
    return address;
  }
  public void setAddress( String address )
  {
    this.address = address;
  }
}


