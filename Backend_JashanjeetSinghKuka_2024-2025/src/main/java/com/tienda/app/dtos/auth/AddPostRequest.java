/**
 * Author: jashanjeetsingh
 * Created on 13/3/25 at 09:00
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.dtos.auth;
import com.tienda.app.enums.Currency;

import java.math.BigDecimal;
public class AddPostRequest
{
  private String name;
  private String description;
  private String image;
//  private byte[] image;
  private BigDecimal price;
  private Currency currency;
  private String username;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

//  public byte[] getImage()
//  {
//    return image;
//  }
//  public void setImage( byte[] image )
//  {
//    this.image = image;
//  }
  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

//  public Double getTax() {
//    return tax;
//  }
//
//  public void setTax(Double tax) {
//    this.tax = tax;
//  }

  public Currency getCurrency() {
    return currency;
  }

  public void setCurrency(Currency currency) {
    this.currency = currency;
  }

  public String getUsername()
  {
    return username;
  }
  public void setUsername( String username )
  {
    this.username = username;
  }
}
