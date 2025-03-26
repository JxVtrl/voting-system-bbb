package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type Participant struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	ImageURL string `json:"imageUrl"`
	Status   string `json:"status"`
	IsActive bool   `json:"isActive"`
	Votes    int    `json:"votes"`
}

type Voting struct {
	ID           string       `json:"id"`
	Participants []Participant `json:"participants"`
	StartTime    time.Time    `json:"startTime"`
	Votes        map[int]int  `json:"votes"`
}

type VotingStatus struct {
	IsEnabled     bool         `json:"isEnabled"`
	StartTime     string       `json:"startTime,omitempty"`
	EndTime       string       `json:"endTime,omitempty"`
	TotalVotes    int          `json:"totalVotes"`
	Participants  []Participant `json:"participants"`
	Votes         map[int]int  `json:"votes"`
}

type VotingHistory struct {
	ID           string       `json:"id"`
	Participants []Participant `json:"participants"`
	Winner       *Participant `json:"winner"`
	TotalVotes   int          `json:"totalVotes"`
	EndTime      time.Time    `json:"endTime"`
}

var participants = make(map[int]Participant)
var currentVoting *Voting
var votingStatus = VotingStatus{
	IsEnabled: false,
}
var votingHistory []VotingHistory

func init() {
	// Inicializa os participantes com IDs numéricos
	participantsList := []Participant{
		{ID: 1, Name: "Aline", ImageURL: "https://s2.glbimg.com/BP82Ew-JnAgxPxFnvIhvdqaLsPs=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/6/K/3rOk79SQiWAqL0AnZxJw/aline-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 2, Name: "Vinícius", ImageURL: "https://s2.glbimg.com/HY3hReI2ddPdQbzfutbdIIoe8eQ=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/P/7/OTwcPASPGP4gbmy3QsuA/vinicius-bbb-25.png", IsActive: true},
		{ID: 3, Name: "Arleane", ImageURL: "https://s2.glbimg.com/cig7f5qU-1V2WE14Rj-MHsqxwMo=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/A/u/ncRjVERJAv9VjvMpiQyA/arleane-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 4, Name: "Marcelo", ImageURL: "https://s2.glbimg.com/3reaY-P_hhUQkJnj3hzaj4H2V_g=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/0/T/sBh6wlRx6CBU2QX7m6lA/marcelo-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 5, Name: "Camilla", ImageURL: "https://s2.glbimg.com/2x_1MSjYLO1zaHfHjXnM3RlRdtM=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/w/R/5qAqGiTEArB0yMUptk5A/camila-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 6, Name: "Thamiris", ImageURL: "https://s2.glbimg.com/PY0BHk7p8bhg2VIimyKS24d1P04=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/i/S/At5qCZSz6EqHtvBTJHLw/thamiris-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 7, Name: "Daniele Hypolito", ImageURL: "https://s2.glbimg.com/tMhq3B0Tz4cukRi0AMKyr5eeoGw=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/h/2/22pebxTkGxchRBUlK8MQ/daniele-bbb-25.png", IsActive: true},
		{ID: 8, Name: "Diego Hypolito", ImageURL: "https://s2.glbimg.com/zMwedNYl83ucrGEep3QspGvC2NM=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/L/M/TWeMYUTx2BTlJM5qRKtQ/diego-bbb-25.png", IsActive: true},
		{ID: 9, Name: "Diogo Almeida", ImageURL: "https://s2.glbimg.com/G96s9uUh5NelnbCSCfXLXE6qoeQ=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/b/y/RwiHQzSkWIbm5YIHga0w/diogo-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 10, Name: "Vilma", ImageURL: "https://s2.glbimg.com/b5Q-1gz6YZZR2osc7Z6IHIgg0Qo=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/Q/B/prKIZiQAGkJPRtHrRirw/vilma-bbb-25.png", IsActive: true},
		{ID: 11, Name: "Edilberto", ImageURL: "https://s2.glbimg.com/T2-nzU8RGQYWt1jWUGofUYwWkoE=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/l/5/P8dJ0BSPmTeCeeb0Caiw/edilberto-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 12, Name: "Raissa", ImageURL: "https://s2.glbimg.com/07z_KxTItCLUX9a9QerzK4RJYXE=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/D/t/raObCaTgA5niMPugBMKg/raissa-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 13, Name: "Eva", ImageURL: "https://s2.glbimg.com/iWVO7h3QlGiV8BwD0RYDx7cEwxU=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/L/B/wM4kF4Tpy0SpX2sA4rwQ/eva-bbb-25.png", IsActive: true},
		{ID: 14, Name: "Renata", ImageURL: "https://s2.glbimg.com/NWPDpEC0-wPrndUxzfLjoCqRUcw=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/t/r/zVRCCJQCivrP42Wnlstg/renata-bbb-25.png", Status: "líder", IsActive: true},
		{ID: 15, Name: "Gabriel", ImageURL: "https://s2.glbimg.com/0xNq2yiP56tVmQTrsJugX9F16Ds=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/G/u/PtDQNWQvat18KX5MrbxQ/gabriel-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 16, Name: "Maike", ImageURL: "https://s2.glbimg.com/kT69XDgS68cKcD2oQx11OBpwZFg=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/3/e/DcDKDsT1KFSELrDBP8CQ/maike-bbb-25.png", IsActive: true},
		{ID: 17, Name: "Gracyanne Barbosa", ImageURL: "https://s2.glbimg.com/-dBPW_G7xXmtTVTY4He-CsGqiR4=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/O/b/2aAkGqQVye0oLJBQNpjw/gracyanne-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 18, Name: "Giovanna", ImageURL: "https://s2.glbimg.com/cCqbmUTyM5JkF81LA0FDA7UOc7U=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/W/8/lDhnWkT1G14vIqdGDA1Q/giovanna-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: 19, Name: "Guilherme", ImageURL: "https://s2.glbimg.com/DmsApwFL9BbGa8mJVI38sFGOMVY=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/z/F/MAL0oiQWy522aXB9Q0tw/guilherme-bbb-25.png", IsActive: true},
		{ID: 20, Name: "Joselma", ImageURL: "https://s2.glbimg.com/kOXnDmx4ZRe9BKv-PI_tYdZutGM=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/a/l/UwBn2JQj2glsBZN4TyiA/joselma-bbb-25.png", IsActive: true},
		{ID: 21, Name: "João Gabriel", ImageURL: "https://s2.glbimg.com/L6FYUD9bMsw-P--MJZbDuhjudQQ=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/1/7/LlAxWeTiOwAmMwPnJAZw/joaogabriel-bbb-25.png", IsActive: true},
		{ID: 22, Name: "João Pedro", ImageURL: "https://s2.glbimg.com/jXyWF4ADoBKr5iDoc1cVX1IC_dw=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/4/V/exCOZxTdy475FMuDRk3Q/joaopedro-bbb-25.png", IsActive: true},
		{ID: 23, Name: "Vitória Strada", ImageURL: "https://s2.glbimg.com/PoantXfakW-hCaMT8vwfzWniQDM=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/6/r/RL6bRLR2yrvZTOHA0E7Q/vitoria-bbb-25.png", IsActive: true},
		{ID: 24, Name: "Mateus", ImageURL: "https://s2.glbimg.com/4dDnO_vHi9lRvQgckLqIB-cIaOc=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/A/F/5evWSESmuY2k9WwG9rFg/mateus-bbb-25.png", Status: "eliminado", IsActive: false},
	}

	for _, p := range participantsList {
		participants[p.ID] = p
	}
}

func enableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	(*w).Header().Set("Access-Control-Max-Age", "3600")
	log.Println("CORS habilitado para a requisição")
}

func handleOptions(w http.ResponseWriter, r *http.Request) {
	log.Printf("Requisição OPTIONS recebida para %s", r.URL.Path)
	enableCORS(&w)
	w.WriteHeader(http.StatusOK)
	log.Println("Resposta OPTIONS enviada com sucesso")
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Requisição %s recebida para %s", r.Method, r.URL.Path)
		enableCORS(&w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			log.Println("Requisição OPTIONS tratada pelo middleware")
			return
		}
		next(w, r)
	}
}

func getParticipants(w http.ResponseWriter, r *http.Request) {
	log.Println("Buscando lista de participantes")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(participants)
	log.Printf("Lista de %d participantes enviada com sucesso", len(participants))
}

func getVotingStatus(w http.ResponseWriter, r *http.Request) {
	log.Printf("Buscando status da votação. Votação ativa: %v", votingStatus.IsEnabled)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(votingStatus)
	log.Printf("Status da votação enviado com sucesso. Total de votos: %d", votingStatus.TotalVotes)
}

func handleStartVoting(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var request struct {
		ParticipantIDs []int `json:"participantIds"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Erro ao decodificar requisição", http.StatusBadRequest)
		return
	}

	// Verifica se há pelo menos 2 participantes
	if len(request.ParticipantIDs) < 2 {
		http.Error(w, "Número incorreto de participantes: mínimo de 2 participantes", http.StatusBadRequest)
		return
	}

	// Verifica se todos os participantes existem e não são líderes
	var selectedParticipants []Participant
	for _, id := range request.ParticipantIDs {
		participant, exists := participants[id]
		if !exists {
			http.Error(w, fmt.Sprintf("Participante não encontrado: %d", id), http.StatusBadRequest)
			return
		}
		if participant.Status == "líder" {
			http.Error(w, fmt.Sprintf("Participante é líder e não pode participar do paredão: %s", participant.Name), http.StatusBadRequest)
			return
		}
		selectedParticipants = append(selectedParticipants, participant)
	}

	// Inicia a votação
	votingStatus = VotingStatus{
		IsEnabled:    true,
		StartTime:    time.Now().Format(time.RFC3339),
		TotalVotes:   0,
		Participants: selectedParticipants,
		Votes:        make(map[int]int),
	}

	// Atualiza o status dos participantes
	for _, participant := range selectedParticipants {
		p := participants[participant.ID]
		p.Status = "no paredão"
		participants[participant.ID] = p
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Votação iniciada com sucesso",
	})
}

func endVoting(w http.ResponseWriter, r *http.Request) {
	log.Println("Encerrando votação atual")
	if r.Method != http.MethodPost {
		log.Printf("Método não permitido: %s", r.Method)
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	if !votingStatus.IsEnabled {
		log.Println("Tentativa de encerrar votação que não está ativa")
		http.Error(w, "Nenhuma votação em andamento", http.StatusBadRequest)
		return
	}

	// Encontrar o vencedor
	var winner *Participant
	maxVotes := 0
	for _, p := range votingStatus.Participants {
		if p.Votes > maxVotes {
			maxVotes = p.Votes
			winner = &p
		}
	}

	// Se não houver vencedor (empate ou sem votos), não atualiza o status dos participantes
	if winner != nil {
		log.Printf("Vencedor do paredão: %s com %d votos", winner.Name, winner.Votes)

		// Atualizar status dos participantes
		for _, p := range votingStatus.Participants {
			if p.ID != winner.ID {
				participant := participants[p.ID]
				participant.Status = "eliminado"
				participant.IsActive = false
				participants[p.ID] = participant
				log.Printf("Participante eliminado: %s", participant.Name)
			}
		}
	} else {
		log.Println("Nenhum voto registrado no paredão")
	}

	// Criar histórico
	history := VotingHistory{
		ID:           time.Now().Format("20060102150405"),
		Participants: votingStatus.Participants,
		Winner:       winner,
		TotalVotes:   votingStatus.TotalVotes,
		EndTime:      time.Now(),
	}
	votingHistory = append(votingHistory, history)
	log.Printf("Histórico atualizado. Total de paredões: %d", len(votingHistory))

	// Resetar status da votação
	votingStatus = VotingStatus{
		IsEnabled: false,
	}

	w.WriteHeader(http.StatusOK)
	log.Println("Paredão encerrado com sucesso")
}

func getVotingHistory(w http.ResponseWriter, r *http.Request) {
	log.Printf("Buscando histórico de paredões. Total: %d", len(votingHistory))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(votingHistory)
	log.Println("Histórico enviado com sucesso")
}

func handleVote(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	if !votingStatus.IsEnabled {
		http.Error(w, "Votação não está ativa", http.StatusBadRequest)
		return
	}

	var request struct {
		ParticipantID int `json:"participantId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Erro ao decodificar requisição", http.StatusBadRequest)
		return
	}

	// Verifica se o participante está no paredão
	participant, exists := participants[request.ParticipantID]
	if !exists {
		http.Error(w, "Participante não encontrado", http.StatusNotFound)
		return
	}

	if participant.Status != "no paredão" {
		http.Error(w, "Participante não está no paredão", http.StatusBadRequest)
		return
	}

	// Registra o voto
	votingStatus.Votes[request.ParticipantID]++
	votingStatus.TotalVotes++

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Voto registrado com sucesso",
	})
}

func updateParticipantStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	participantID := r.URL.Path[len("/participantes/"):]
	participantID = participantID[:len(participantID)-len("/status")]

	var request struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Erro ao decodificar requisição", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(participantID)
	if err != nil {
		http.Error(w, "ID de participante inválido", http.StatusBadRequest)
		return
	}

	if participant, exists := participants[id]; exists {
		participant.Status = request.Status
		participants[id] = participant
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Error(w, "Participante não encontrado", http.StatusNotFound)
}

func updateParticipantActive(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	participantID := r.URL.Path[len("/participantes/"):]
	participantID = participantID[:len(participantID)-len("/ativo")]

	var request struct {
		IsActive bool `json:"isActive"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Erro ao decodificar requisição", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(participantID)
	if err != nil {
		http.Error(w, "ID de participante inválido", http.StatusBadRequest)
		return
	}

	if participant, exists := participants[id]; exists {
		participant.IsActive = request.IsActive
		participants[id] = participant
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Error(w, "Participante não encontrado", http.StatusNotFound)
}

func main() {
	log.Println("Iniciando servidor na porta 8080")
	
	http.HandleFunc("/participantes", corsMiddleware(getParticipants))
	http.HandleFunc("/participantes/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			handleOptions(w, r)
			return
		}
		
		if strings.HasSuffix(r.URL.Path, "/status") {
			corsMiddleware(updateParticipantStatus)(w, r)
		} else if strings.HasSuffix(r.URL.Path, "/ativo") {
			corsMiddleware(updateParticipantActive)(w, r)
		} else {
			http.Error(w, "Rota não encontrada", http.StatusNotFound)
		}
	})
	http.HandleFunc("/status", corsMiddleware(getVotingStatus))
	http.HandleFunc("/iniciar-votacao", corsMiddleware(handleStartVoting))
	http.HandleFunc("/encerrar-votacao", corsMiddleware(endVoting))
	http.HandleFunc("/historico", corsMiddleware(getVotingHistory))
	http.HandleFunc("/votar", corsMiddleware(handleVote))

	log.Println("Rotas configuradas com sucesso")
	log.Fatal(http.ListenAndServe(":8080", nil))
} 