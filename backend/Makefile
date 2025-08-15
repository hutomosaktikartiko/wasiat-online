.PHONY: build run clean test install

build:
	CGO_ENABLED=1 go build -o bin/keeper ./cmd/keeper

run:
	go run ./cmd/keeper

clean:
	rm -rf bin/

test:
	go test ./...

install:
	sudo cp bin/keeper /usr/local/bin/
	echo "Keeper installed to /usr/local/bin/keeper"