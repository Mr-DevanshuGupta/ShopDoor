package com.devanshu.ecommerce.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

@Service
public class FileStorageService {
	@Value("${file.upload-dir}")
	private String uploadDir;

	@PostConstruct
	public void init() {
		File uploadDirFile = new File(uploadDir);
		if (!uploadDirFile.exists()) {
			uploadDirFile.mkdirs();
		}
	}

	public String storeFile(MultipartFile file) throws IOException {
		String fileName = file.getOriginalFilename();
		Path path = Paths.get(uploadDir + File.separator + fileName);
		Files.write(path, file.getBytes());
		return fileName;
	}

	public byte[] loadFile(String fileName) throws IOException {
		Path path = Paths.get(uploadDir + File.separator + fileName);
		return Files.readAllBytes(path);
	}

	public void deleteFile(String fileName) throws IOException {
		Path path = Paths.get(uploadDir + File.separator + fileName);
		Files.deleteIfExists(path);
	}
}
