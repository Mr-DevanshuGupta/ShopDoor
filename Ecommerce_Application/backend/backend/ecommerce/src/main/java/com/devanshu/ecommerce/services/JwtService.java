package com.devanshu.ecommerce.services;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	private static final String SECRET_KEY = "hjgTNolfNlBDR1ujR+rvqz2bbBtOj25h3fExm35bmXJhN747VkE55qKUXLdLMV+PqWlFcfovc+zaZOVfOadhxM3Ckp3hdEWimnPWeWPet8zkgo1zCtoh/dLzCR5Q9u/E+jwZRmHasL68G3yKvdXMJ+LupkNN0ZBjUd3t7WokDCVqWltxGggW1mEFaoU80DzwbYDdRIOgRyO56J54Hzk7qt17j1efetQTrhiv+NLNw+YAZmAoQA+xvXGisV17+pjY3uf8IYU87828cZL3OBRv6T88yRPQ37eGc/z06VikD3FnfUDhypDVbVNe5S9U4jn7BLpyATjTeo48T6rU+UfF35SvJpcvYwuJTPQsJJt++2k=\r\n"
			+ "";

	public String extractUsername(String token) {

		return extractClaim(token, Claims::getSubject);
	}

	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
		Date date = new Date(System.currentTimeMillis() + 1000 * 60 * 60);
		System.out.println("this is the expiration time " + date);
		return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
				.signWith(getSignInKey(), SignatureAlgorithm.HS256).compact();
	}

	public String generateToken(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("roles", userDetails.getAuthorities());
		return generateToken(new HashMap<>(), userDetails);
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
		return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	private Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token).getBody();
	}

	private Key getSignInKey() {
		byte[] KeyBytes = Decoders.BASE64.decode(SECRET_KEY);

		return Keys.hmacShaKeyFor(KeyBytes);
	}
}
