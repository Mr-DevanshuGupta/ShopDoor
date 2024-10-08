package com.devanshu.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.Enum.Colors;
import com.devanshu.ecommerce.entity.ColorVariant;
import com.devanshu.ecommerce.entity.Product;

public interface ColorVariantRepository extends JpaRepository<ColorVariant, Integer> {

	ColorVariant findByName(Colors color);

}
