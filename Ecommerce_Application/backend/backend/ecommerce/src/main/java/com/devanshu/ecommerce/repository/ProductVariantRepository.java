package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.devanshu.ecommerce.entity.ColorVariant;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.ProductVariant;
import com.devanshu.ecommerce.entity.SizeVariant;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {

	@Query("Select pv.colorVariant from ProductVariant pv where pv.product.id = :productId AND pv.isActive = true")
	List<ColorVariant> findColorByProductId(Integer productId);

	@Query("Select pv.sizeVariant from ProductVariant pv where pv.product.id = :productId AND pv.isActive = true")
	List<SizeVariant> findSizeByProductId(Integer productId);

//	ProductVariant findByProductAndSizeVariantAndColorVariant(Product product, SizeVariant sizeVariant,
//			ColorVariant colorVariant);

	@Query("SELECT pv FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.sizeVariant.id = :sizeVariantId AND pv.colorVariant.id = :colorVariantId")
    ProductVariant findByProductAndSizeVariantAndColorVariant(
        Integer productId,
        Integer sizeVariantId,
        Integer colorVariantId
    );
	void deleteAllByProduct(Product product);

	List<ProductVariant> findAllByProduct(Product product);

	List<ProductVariant> findAllByProductAndIsActiveTrue(Product product);

	@Modifying
	@Query("UPDATE ProductVariant pv SET pv.isActive = false WHERE pv.product.id = :productId")
	void deactivateAllVariantsByProduct(Integer productId);

}
