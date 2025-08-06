/**
 * Author: jashanjeetsingh
 * Created on 12/3/25 at 14:48
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.dtos.auth;
public class ChangePasswordRequest {
  private String oldPassword;
  private String newPassword;

  // Getters and Setters
  public String getOldPassword() {
    return oldPassword;
  }

  public void setOldPassword(String oldPassword) {
    this.oldPassword = oldPassword;
  }

  public String getNewPassword() {
    return newPassword;
  }

  public void setNewPassword(String newPassword) {
    this.newPassword = newPassword;
  }
}
