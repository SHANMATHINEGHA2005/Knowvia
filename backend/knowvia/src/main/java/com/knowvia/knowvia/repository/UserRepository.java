package com.knowvia.knowvia.repository;

import com.knowvia.knowvia.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);  

    @Query(value = "SELECT * FROM users ORDER BY points DESC LIMIT 10", nativeQuery = true)
    List<User> findTop10ByOrderByPointsDesc();

}