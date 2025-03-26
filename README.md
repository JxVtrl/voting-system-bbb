# Sistema de Votação BBB

Este projeto é um sistema de votação de alto tráfego construído para o desafio SRE da Globo.

## Estrutura

- `backend/`: API REST em Go
- `frontend/`: Interface web para votação
- `infra/`: Observabilidade, CI/CD, Docker, etc.
- `docs/`: Documentação adicional

## Requisitos

- Suporte a mais de 1000 votos/segundo
- Métricas em tempo real
- Healthcheck
- Fácil deploy com Docker

## Como executar

### Backend
```bash
cd backend
go mod init github.com/seu-usuario/bbb-votacao-backend
go run main.go
```

### Frontend
Abra o arquivo `frontend/index.html` em seu navegador ou use um servidor HTTP simples.

## Tecnologias utilizadas

- Backend: Go
- Frontend: HTML, JavaScript
- Infraestrutura: Docker, Prometheus, Grafana 