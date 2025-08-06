package com.tienda.app.controllers;

import com.tienda.app.models.Post;
import com.tienda.app.models.User;
import com.tienda.app.models.UserInfo;
import com.tienda.app.repositories.UserRepository;
import com.tienda.app.repositories.LikeRepository;
import com.tienda.app.services.UserService;
//import com.skillSphere.app.dtos.auth.*;
import com.tienda.app.dtos.auth.*;
import com.tienda.app.exception.InvalidPasswordException;
import com.tienda.app.exception.UserNotFoundException;
import com.tienda.app.repositories.PostRepository;
import com.tienda.app.repositories.CommentRepository;
import com.tienda.app.enums.RoleName;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.tienda.app.repositories.UserPurchaseRepository;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


/*
 *
 * http://localhost:8080/ -> Esta es la URL base para conectarnos a SpringBoot
 * http://localhost:8080/api -> Si tenemos el context-path en app.properties, la URL base cambia
 *
 * * */

// http://localhost:8080/api/users

/*
 *
 * 200 -> Todo bien
 * 201 -> Todo bien pero para update
 * 204 -> Todo bien pero para borrar
 * 400 -> Error de identification
 * 401 -> Error de datos incorrectos
 * 403 -> Permiso denegado
 * 404 -> No se ha encontrado
 * 500 -> Error en el servidor. Esto ocurre por fallo en el código
 *
 * */
@RestController
@RequestMapping( "/users" )
@CrossOrigin( "*" )
public class UserController
{

  private final UserService userService;
  private final UserPurchaseRepository userPurchaseRepository;
  private final CommentRepository commentRepository;
  private final PostRepository postRepository;
  private final UserRepository userRepository;
  private final LikeRepository likeRepository;


  public UserController( UserService userService , UserPurchaseRepository userPurchaseRepository , CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository, LikeRepository likeRepository)
  {
    this.userService = userService;
    this.userPurchaseRepository = userPurchaseRepository;
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.likeRepository = likeRepository;
  }

  @GetMapping
  public ResponseEntity< List< User > > getAllUsers()
  {
    return ResponseEntity.ok( this.userService.getAllUsers() );
  }

  // http://localhost:8080/api/users/login
  @PostMapping( "/login" )
  public ResponseEntity< ? > login( @RequestBody LoginRequest credentials )
  {
    try
    {
      LoginResponse loginResponse = this.userService.login( credentials );
      return ResponseEntity.ok( loginResponse );
    }
    catch( BadCredentialsException e )
    {
      return ResponseEntity.status( 401 ).body( e.getMessage() );
    }
  }

  @PostMapping( "/register" )
  public ResponseEntity< ? > register( @RequestBody RegisterRequest registerRequest )
  {
    try
    {
      User user = this.userService.createUser( registerRequest );
      return ResponseEntity.ok( user );
    }
    catch( IllegalArgumentException e )
    {
      return ResponseEntity.status( 401 ).body( e.getMessage() );
    }
  }

  @PostMapping( "/check-token" )
  public ResponseEntity< Boolean > checkToken( @RequestBody CheckTokenRequest checkTokenRequest )
  {
    return ResponseEntity.ok( this.userService.checkToken( checkTokenRequest ) );
  }

  // New endpoint to fetch user profile
  @GetMapping( "/profile" )
  public ResponseEntity< Map< String, Object > > getUserProfile()
  {
    // Get the authenticated user's username from the security context
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    // Fetch the user's profile data
    User user = userService.getUserByUsername( username );

    if( user != null )
    {
      // Fetch the associated UserInfo
      UserInfo userInfo = user.getUserInfo();

      Map< String, Object > response = new HashMap<>();
      response.put( "username" , user.getUsername() );
      response.put( "role" , user.getRole().getRoleName() ); // Assuming Role has a getRoleName() method
      response.put( "firstName" , userInfo != null ? userInfo.getFirstName() : null );
      response.put( "lastName" , userInfo != null ? userInfo.getLastName() : null );
      response.put( "address" , userInfo != null ? userInfo.getAddress() : null );

      return ResponseEntity.ok( response );
    }
    else
    {
      return ResponseEntity.status( 404 ).body( null ); // User not found
    }
  }
  @PostMapping( "/change-password" )
  public ResponseEntity< ? > changePassword( @RequestBody ChangePasswordRequest request )
  {
    try
    {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      String username = authentication.getName();

      userService.changePassword( username , request.getOldPassword() , request.getNewPassword() );

      return ResponseEntity.ok().body( Map.of( "message" , "Password changed successfully" ) );
    }
    catch( UserNotFoundException e )
    {
      return ResponseEntity.status( 404 ).body( Map.of( "error" , e.getMessage() ) );
    }
    catch( InvalidPasswordException e )
    {
      return ResponseEntity.status( 400 ).body( Map.of( "error" , e.getMessage() ) );
    }
    catch( Exception e )
    {
      return ResponseEntity.status( 500 ).body( Map.of( "error" , "Internal server error" ) );
    }
  }

  // Upload or update profile picture
  @PostMapping( "/{username}/profile-picture" )
  public ResponseEntity< Map< String, String > > uploadProfilePicture( @PathVariable String username , @RequestBody String base64Image )
  {

    userService.updateUserProfilePicture( username , base64Image );
    return ResponseEntity.ok().contentType( MediaType.APPLICATION_JSON ).body( Map.of( "message" , "Profile picture updated successfully" ) );
  }

  // Fetch profile picture
  @GetMapping( "/{username}/profile-picture" )
  public ResponseEntity< byte[] > getProfilePicture( @PathVariable String username )
  {
    byte[] image = userService.getUserProfilePicture( username );
    if( image == null || image.length == 0 )
    {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok().contentType( MediaType.IMAGE_JPEG ) // or MediaType.IMAGE_PNG
        .body( image );
  }

  @PutMapping( "/profile" )
  public ResponseEntity< ? > updateProfile( @RequestBody UserProfileUpdateRequest updateRequest , Authentication authentication )
  {
    String username = authentication.getName();
    userService.updateUserProfile( username , updateRequest );
    return ResponseEntity.ok( Map.of( "message" , "Profile updated successfully" ) );
  }

  @GetMapping( "/{username}/purchases" )
  public ResponseEntity< List< PurchaseDTO > > getUserPurchases( @PathVariable String username , @AuthenticationPrincipal UserDetails userDetails )
  {

    if( ! userDetails.getUsername().equals( username ) )
    {
      return ResponseEntity.status( HttpStatus.FORBIDDEN ).build();
    }

    List< Post > posts = userPurchaseRepository.findPostsByUsername( username );

    // Convert Posts to PurchaseDtos
    List< PurchaseDTO > purchaseDtos = posts.stream().map( post -> new PurchaseDTO( post.getId() , post.getName() , post.getDescription()
        // Add other fields you need from Post
    ) ).collect( Collectors.toList() );

    return ResponseEntity.ok( purchaseDtos );
  }

  @GetMapping( "/admin/user-post-summaries" )
  public ResponseEntity< List< UserPostSummaryDTO > > getAllUserPostSummaries()
  {
    return ResponseEntity.ok( userService.getAllUserPostSummaries() );
  }

  @DeleteMapping("/delete/{username}")
  public ResponseEntity<String> deleteUserByUsername(@PathVariable String username) {
      try {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        likeRepository.deleteAllByUser(user);
        userService.deleteUserByUsername(username);
          return ResponseEntity.ok("User deleted successfully");
      } catch ( UsernameNotFoundException e) {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
      }
  }

  @GetMapping("/count")
  public ResponseEntity<Map<String, Long>> getTotalCounts() {
    long totalUsers = userRepository.count();
    long totalStudents = userRepository.countByRole(RoleName.STUDENT); // Correct enum access
    long totalTeachers = userRepository.countByRole(RoleName.TEACHER); // Correct enum access
    long totalPosts = postRepository.count();

    Map<String, Long> response = new HashMap<>();
    response.put("totalUsers", totalUsers);
    response.put("totalStudents", totalStudents);
    response.put("totalTeachers", totalTeachers);
    response.put("totalPosts", totalPosts);

    return ResponseEntity.ok(response);
  }

}
