# Stage 1: Build
FROM golang:1.23-alpine AS builder
WORKDIR /app

# Install gcc for CGO (required by go-sqlite3)
RUN apk add --no-cache gcc musl-dev

COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 go build -o main ./cmd/keeper

# Stage 2: Run
FROM docker.io/library/alpine:latest
WORKDIR /app

# Install sqlite runtime dependency
RUN apk add --no-cache sqlite-libs

COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]