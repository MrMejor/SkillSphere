package com.tienda.app.repositories;

import com.tienda.app.enums.RoleName;
import com.tienda.app.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository< User, Long >
{

  // Encontrar un usuario por username
  //    Optional<User> findByUsername(String username);

  // comprobar si existe un usuario por username
  boolean existsByUsername( String username );
  @Transactional( readOnly = true )
  @Query( "SELECT u FROM User u LEFT JOIN FETCH u.userInfo WHERE u.username = :username" )
  Optional< User > findByUsername( @Param( "username" ) String username );

  void deleteAllById(Long userId); // or you can skip this method, as JPA has deleteById()


  @Query("SELECT COUNT(u) FROM User u WHERE u.role.roleName = :role")
  long countByRole(@Param("role") RoleName role);

}
