package com.tienda.app.repositories;

import com.tienda.app.models.User;
import com.tienda.app.models.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository< UserInfo, Long> {

    @Modifying
    @Transactional
    void deleteByUser( User user);
    Optional<UserInfo> findByUserId(Long userId);

}
