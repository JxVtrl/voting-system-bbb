FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod .
COPY main.go .

RUN go mod download

EXPOSE 8080

CMD ["go", "run", "main.go"] 