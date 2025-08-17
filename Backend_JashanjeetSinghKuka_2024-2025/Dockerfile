# Build stage: use Maven with JDK
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage: use JRE only (lighter)
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Bind to Render's dynamic PORT
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
