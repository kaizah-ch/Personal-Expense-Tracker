package com.kaizahchibinda.expensetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class ExpenseTrackerApiApplication {

	public static void main(String[] args) {
		String cwd = System.getProperty("user.dir");
		System.out.println("Starting application... CWD: " + cwd);

		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

		if (dotenv.get("SPRING_DATASOURCE_URL") == null) {
			System.out.println("SPRING_DATASOURCE_URL not found in default location.");

			// Construct path using Paths carefully
			java.nio.file.Path possiblePath = java.nio.file.Paths.get(cwd, "backend", "expense-tracker-api");
			java.io.File dir = possiblePath.toFile();

			System.out.println("Checking alternative directory: " + dir.getAbsolutePath());

			if (dir.exists() && dir.isDirectory()) {
				System.out.println("Directory exists. Checking for .env file...");
				java.io.File envFile = new java.io.File(dir, ".env");
				if (envFile.exists()) {
					System.out.println("FOUND .env file at: " + envFile.getAbsolutePath());
					// Load using the absolute path of the directory
					dotenv = Dotenv.configure().directory(dir.getAbsolutePath()).ignoreIfMissing().load();
				} else {
					System.out.println("FAILED: .env file NOT found in " + dir.getAbsolutePath());
					System.out.println("Listing directory contents:");
					String[] files = dir.list();
					if (files != null) {
						for (String f : files) {
							System.out.println(" - " + f);
						}
					}
				}
			} else {
				System.out.println("FAILED: Directory does not exist: " + dir.getAbsolutePath());
				// Try to list root contents to see what's there
				java.io.File root = new java.io.File(cwd);
				System.out.println("Listing root contents:");
				String[] files = root.list();
				if (files != null) {
					for (String f : files) {
						System.out.println(" - " + f);
					}
				}
			}
		}

		if (!dotenv.entries().isEmpty()) {
			System.out.println("Loaded environment variables (" + dotenv.entries().size() + " entries).");
			dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		} else {
			System.err.println("CRITICAL WARNING: No environment variables loaded! Connection will likely fail.");
		}

		SpringApplication.run(ExpenseTrackerApiApplication.class, args);
	}

}
