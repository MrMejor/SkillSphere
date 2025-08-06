/**
 * Author: jashanjeetsingh
 * Created on 25/5/25 at 00:08
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.dtos.auth;

public class PurchaseDTO {
  private Long id;
  private String name;
  private String description;
  // Add other fields you need from Post

  public PurchaseDTO() {}

  public PurchaseDTO(Long id, String name, String description /*, other fields */) {
    this.id = id;
    this.name = name;
    this.description = description;
    // set other fields
  }

  // Getters and setters for all fields
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  // Add getters/setters for other fields
}


