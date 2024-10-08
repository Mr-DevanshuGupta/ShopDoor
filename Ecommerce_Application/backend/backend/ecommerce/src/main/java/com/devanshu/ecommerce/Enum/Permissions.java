package com.devanshu.ecommerce.Enum;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permissions {
	ADMIN_READ("admin:read");

	@Getter
	private final String permission;
}
