# Stage 1: Build
FROM golang:1.23 AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 go build -o main ./cmd/keeper

# Stage 2: Run
FROM docker.io/library/debian:bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libsqlite3-0 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]