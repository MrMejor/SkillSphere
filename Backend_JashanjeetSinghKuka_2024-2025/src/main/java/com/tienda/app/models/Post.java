package com.tienda.app.models;

import com.tienda.app.enums.Currency;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table( name = "posts" )
public class Post
{

  @Id
  @GeneratedValue( strategy = GenerationType.IDENTITY )
  private Long id;

  @Column( nullable = false )
  private String name;

  private String description;

  @Lob
  @Column( name = "image", columnDefinition = "LONGBLOB" )
  private byte[] image;

  @Column( nullable = true )
  private BigDecimal price;

  @Column( nullable = true )
  private Double tax = 0.0;

  // Tipo de moneda
  @Column( nullable = true )
  private Currency currency;

  @CreationTimestamp
  private LocalDateTime createdAt = LocalDateTime.now();

  @ManyToOne
  @JoinColumn( name = "seller_id", nullable = false )
  private User seller;

  @OneToMany( mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true )
  private List< Like > likes = new ArrayList<>();

  @OneToMany( mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true )
  @OrderBy( "createdAt DESC" )
  private List< Comment > comments = new ArrayList<>();
  public List< Comment > getCommentscount()
  {
    return comments;
  }

  @ManyToOne
  @JoinColumn( name = "user_id", nullable = true )
  private User user;

  public User getUser()
  {
    return user;
  }

  // Helper methods
  public int getLikeCount()
  {
    return likes.size();
  }

  public boolean isLikedByUser( Long userId )
  {
    return likes.stream().anyMatch( like -> like.getUser().getId().equals( userId ) );
  }

  public User getSeller()
  {
    return seller;
  }

  public void setSeller( User seller )
  {
    this.seller = seller;
  }

  public Long getId()
  {
    return id;
  }

  public void setId( Long id )
  {
    this.id = id;
  }

  public String getName()
  {
    return name;
  }

  public void setName( String name )
  {
    this.name = name;
  }

  public String getDescription()
  {
    return description;
  }

  public void setDescription( String description )
  {
    this.description = description;
  }

  public byte[] getImage()
  {
    return image;
  }

  public void setImage( byte[] image )
  {
    this.image = image;
  }

  public BigDecimal getPrice()
  {
    return price;
  }

  public void setPrice( BigDecimal price )
  {
    this.price = price;
  }

  public Double getTax()
  {
    return tax;
  }

  public void setTax( Double tax )
  {
    this.tax = tax;
  }

  public Currency getCurrency()
  {
    return currency;
  }

  public void setCurrency( Currency currency )
  {
    this.currency = currency;
  }

  public LocalDateTime getCreatedAt()
  {
    return createdAt;
  }

  public void setCreatedAt( LocalDateTime createdAt )
  {
    this.createdAt = createdAt;
  }

  public List< Like > getLikes()
  {
    return likes;
  }

  public void setLikes( List< Like > likes )
  {
    this.likes = likes;
  }

  public List< Comment > getComments()
  {
    return comments;
  }

  public void setComments( List< Comment > comments )
  {
    this.comments = comments;
  }

  public void setUser( User user )
  {
    this.user = user;
  }
}
