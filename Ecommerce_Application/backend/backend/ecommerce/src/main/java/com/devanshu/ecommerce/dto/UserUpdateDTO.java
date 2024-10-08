package com.devanshu.ecommerce.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class UserUpdateDTO {
	private String firstName;
    private String lastName;
   
    @Column(unique=true)
    private String email;
    private String password;
}
