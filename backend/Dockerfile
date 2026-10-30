# Contexto de build = raíz del repo: el pom empaqueta ../database y ../frontend/public/legal.
#   docker build -f backend/Dockerfile -t brinda-api .
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY backend/pom.xml backend/pom.xml
COPY database database
COPY frontend/public/legal frontend/public/legal
# El antrun del pom copia ../database/setup/02_grants.sql en process-resources, por eso va antes que las fuentes.
RUN mvn -B -q -f backend/pom.xml dependency:go-offline
COPY backend/src backend/src
# clean package (no solo package): corre MigrationsSeedGuardTest, que rompe el build si el seed llegó a db/migration.
RUN mvn -B -f backend/pom.xml clean package

FROM eclipse-temurin:21-jre
RUN useradd --system --uid 10001 --no-create-home app
WORKDIR /app
COPY --from=build /src/backend/target/api-*.jar app.jar
USER app
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=60 -XX:+UseSerialGC -XX:TieredStopAtLevel=1"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
