# Backend do Sistema de Votação BBB 25

Este é o backend do sistema de votação para o BBB 25, desenvolvido em Go.

## Funcionalidades

- Listagem de participantes
- Gerenciamento de status de votação
- Início e fim de paredões
- Registro de votos
- Histórico de paredões

## Endpoints

### GET /participantes
Retorna a lista de todos os participantes.

### GET /status
Retorna o status atual da votação.

### POST /iniciar-votacao
Inicia um novo paredão. Requer um JSON com a lista de participantes:
```json
{
  "participantes": ["id1", "id2", "id3"]
}
```

### POST /encerrar-votacao
Encerra o paredão atual e registra o resultado.

### GET /historico
Retorna o histórico de paredões realizados.

### POST /votar
Registra um voto para um participante. Requer um JSON com o ID do participante:
```json
{
  "participante": "id_do_participante"
}
```

## Como Executar

1. Certifique-se de ter o Go instalado (versão 1.21 ou superior)
2. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
3. Execute o servidor:
   ```bash
   go run main.go
   ```
4. O servidor estará rodando em `http://localhost:8080`

## Estrutura do Projeto

```
backend/
├── main.go      # Código principal do servidor
├── go.mod       # Arquivo de dependências
└── README.md    # Este arquivo
``` 