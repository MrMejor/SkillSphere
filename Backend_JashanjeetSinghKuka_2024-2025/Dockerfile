# Build stage: usa Maven con JDK 21
FROM maven:3.9.8-eclipse-temurin-21 AS build  # <- Cambiado de 17 a 21
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage: usa JRE 21 (más ligera)
FROM eclipse-temurin:21-jre  # <- Cambiado de 17-jre a 21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Bind to Render's dynamic PORT
EXPOSE 8080

# Puedes mantener CMD o usar ENTRYPOINT (ambos funcionan)
CMD ["java", "-jar", "app.jar"]  # <- tu versión
# ENTRYPOINT ["java","-jar","app.jar"]  # <- alternativa recomendada
