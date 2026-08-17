# =========================================================
# BUILD STAGE
# Maven + Java 21 are already installed in this image
# =========================================================

FROM maven:3.9.16-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven project
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -DskipTests

# Copy source code
COPY src ./src

# Build Spring Boot application
RUN mvn clean package -DskipTests


# =========================================================
# RUNTIME STAGE
# =========================================================

FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy generated Spring Boot JAR
COPY --from=build /app/target/*.jar app.jar

# Default local container port
EXPOSE 8080

# SnapDeploy provides PORT in deployment.
# Locally it falls back to 8090.
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]