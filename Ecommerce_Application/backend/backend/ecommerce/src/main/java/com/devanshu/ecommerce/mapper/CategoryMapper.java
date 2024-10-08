package com.devanshu.ecommerce.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.devanshu.ecommerce.dto.CategoryUpdateDTO;
import com.devanshu.ecommerce.entity.ProductCategory;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
	@Mapping(target = "id", ignore = true)
	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCategoryFromDto(CategoryUpdateDTO dto, @MappingTarget ProductCategory category);

}
