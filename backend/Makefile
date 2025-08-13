.PHONY: build run clean test

build:
	go build -o bin/keeper ./cmd/keeper

run:
	go run ./cmd/keeper

clean:
	rm -rf bin/

test:
	go test ./...

docker-build:
	docker build -t wasiat-keeper .

docker-run:
	docker run --env-file .env wasiat-keeper