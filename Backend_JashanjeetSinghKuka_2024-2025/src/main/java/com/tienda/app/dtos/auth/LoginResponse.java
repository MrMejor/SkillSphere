package com.tienda.app.dtos.auth;

import com.tienda.app.enums.RoleName;


/*
* Retornar al front
*
* {
* token: "sdhgdfsbw435",
* username: "Camilo",
* role: "Admin"
* }
*
* */
public class LoginResponse {

    private String token;

    private String username;

    private RoleName role;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public RoleName getRole() {
        return role;
    }

    public void setRole(RoleName role) {
        this.role = role;
    }
}
