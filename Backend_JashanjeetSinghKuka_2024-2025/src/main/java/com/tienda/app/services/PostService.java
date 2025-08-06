package com.tienda.app.services;

import com.tienda.app.models.Post;
import com.tienda.app.dtos.auth.AddPostRequest;
import com.tienda.app.dtos.auth.GetPostRequest;
import com.tienda.app.models.User;
import com.tienda.app.repositories.PostRepository;
import com.tienda.app.repositories.UserRepository;
import com.tienda.app.repositories.UserPurchaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService
{

  private final PostRepository postRepository;
  private final UserRepository userRepository;
  private final UserPurchaseRepository userPurchaseRepository;

  public PostService( PostRepository postRepository , UserRepository userRepository, UserPurchaseRepository userPurchaseRepository )
  {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.userPurchaseRepository = userPurchaseRepository;
  }

  // Fetch posts by user with liked info for logged-in user
  public List< GetPostRequest > getPostsByUser( String username , String loggedInUsername )
  {
    List< Post > posts = postRepository.findBySellerUsernameOrderByCreatedAtDesc( username );
    return posts.stream().map( post -> mapToGetPostRequestWithoutImage( post , loggedInUsername ) ).collect( Collectors.toList() );
  }

  // Save a new post
  public void savePost( AddPostRequest request )
  {
    User user = this.userRepository.findByUsername( request.getUsername() ).orElseThrow( () -> new IllegalArgumentException( "User Not Found" ) );

    Post post = new Post();
    post.setName( request.getName() );
    post.setDescription( request.getDescription() );

    if( request.getImage() != null )
    {
      String base64Image = request.getImage();
      if( base64Image.contains( "," ) )
      {
        base64Image = base64Image.substring( base64Image.indexOf( "," ) + 1 );
      }
      try
      {
        post.setImage( Base64.getDecoder().decode( base64Image ) );
      }
      catch( IllegalArgumentException e )
      {
        throw new IllegalArgumentException( "Invalid Base64 image format" , e );
      }
    }

    if( request.getPrice() != null )
    {
      if( request.getCurrency() == null )
      {
        throw new IllegalArgumentException( "Currency is required when price is specified" );
      }
      post.setPrice( request.getPrice() );
      post.setCurrency( request.getCurrency() );
    }
    else
    {
      post.setPrice( null );
      post.setCurrency( null );
    }

    post.setSeller( user );
    //    post.setUser(user);

    postRepository.save( post );
  }

  // Get raw image bytes
  public byte[] getPostImage( Long id )
  {
    Post post = postRepository.findById( id ).orElseThrow( () -> new IllegalArgumentException( "Post not found" ) );
    return post.getImage();
  }

  // Map Post entity to GetPostRequest DTO without image
  private GetPostRequest mapToGetPostRequestWithoutImage( Post post , String loggedInUsername )
  {
    GetPostRequest dto = new GetPostRequest();
    dto.setId( post.getId() );
    dto.setName( post.getName() );
    dto.setDescription( post.getDescription() );
    dto.setPrice( post.getPrice() );
    dto.setSellerUsername( post.getSeller().getUsername() );
    dto.setCurrency( post.getCurrency() );
    dto.setCommentCount( post.getCommentscount() != null ? post.getCommentscount().size() : 0 );

    dto.setCreatedAt( post.getCreatedAt() );

    boolean liked = false;
    if( loggedInUsername != null && post.getLikes() != null )
    {
      liked = post.getLikes().stream().anyMatch( like -> like.getUser() != null && loggedInUsername.equals( like.getUser().getUsername() ) );
    }
    dto.setLikedByUser( liked );

    return dto;
  }

  // Map Post entity to GetPostRequest DTO with image
  public GetPostRequest mapToGetPostRequestWithImage( Post post , String loggedInUsername )
  {
    GetPostRequest dto = mapToGetPostRequestWithoutImage( post , loggedInUsername );
    dto.setImage( post.getImage() != null ? Base64.getEncoder().encodeToString( post.getImage() ) : null );
    return dto;
  }

  // Fetch all posts without images for listing
  public List< GetPostRequest > getAllPosts( String loggedInUsername )
  {
    List< Post > posts = postRepository.findAllByOrderByCreatedAtDesc();
    return posts.stream().map( post -> mapToGetPostRequestWithoutImage( post , loggedInUsername ) ).collect( Collectors.toList() );
  }

  public GetPostRequest getPostById( Long postId , String loggedInUsername )
  {
    Post post = postRepository.findById( postId ).orElseThrow( () -> new IllegalArgumentException( "Product not found" ) );
    // Use the version WITHOUT image for the main response
    GetPostRequest dto = mapToGetPostRequestWithoutImage( post , loggedInUsername );
    return dto;
  }

  // Delete a post by ID
  @Transactional
  public void deletePostById(Long postId) {
    userPurchaseRepository.deleteByPostId(postId); // Custom method to delete associated purchases
    postRepository.deleteById(postId);
  }

}