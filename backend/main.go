package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
)

type Participant struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	ImageURL string `json:"imageUrl"`
	Status   string `json:"status,omitempty"`
	IsActive bool   `json:"isActive"`
	Votes    int    `json:"votes,omitempty"`
}

type VotingStatus struct {
	IsEnabled     bool         `json:"isEnabled"`
	StartTime     string       `json:"startTime,omitempty"`
	EndTime       string       `json:"endTime,omitempty"`
	TotalVotes    int          `json:"totalVotes"`
	Participants  []Participant `json:"participants"`
}

type VotingHistory struct {
	ID           string       `json:"id"`
	StartTime    string       `json:"startTime"`
	EndTime      string       `json:"endTime"`
	TotalVotes   int          `json:"totalVotes"`
	Participants []Participant `json:"participants"`
	Winner       *Participant `json:"winner,omitempty"`
}

var (
	participants = []Participant{
		{ID: "aline", Name: "Aline", ImageURL: "https://s2.glbimg.com/BP82Ew-JnAgxPxFnvIhvdqaLsPs=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/6/K/3rOk79SQiWAqL0AnZxJw/aline-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "vinicius", Name: "Vinícius", ImageURL: "https://s2.glbimg.com/HY3hReI2ddPdQbzfutbdIIoe8eQ=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/P/7/OTwcPASPGP4gbmy3QsuA/vinicius-bbb-25.png", IsActive: true},
		{ID: "arleane", Name: "Arleane", ImageURL: "https://s2.glbimg.com/cig7f5qU-1V2WE14Rj-MHsqxwMo=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/A/u/ncRjVERJAv9VjvMpiQyA/arleane-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "marcelo", Name: "Marcelo", ImageURL: "https://s2.glbimg.com/3reaY-P_hhUQkJnj3hzaj4H2V_g=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/0/T/sBh6wlRx6CBU2QX7m6lA/marcelo-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "camilla", Name: "Camilla", ImageURL: "https://s2.glbimg.com/2x_1MSjYLO1zaHfHjXnM3RlRdtM=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/w/R/5qAqGiTEArB0yMUptk5A/camila-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "thamiris", Name: "Thamiris", ImageURL: "https://s2.glbimg.com/PY0BHk7p8bhg2VIimyKS24d1P04=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/i/S/At5qCZSz6EqHtvBTJHLw/thamiris-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "daniele", Name: "Daniele Hypolito", ImageURL: "https://s2.glbimg.com/tMhq3B0Tz4cukRi0AMKyr5eeoGw=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/h/2/22pebxTkGxchRBUlK8MQ/daniele-bbb-25.png", IsActive: true},
		{ID: "diego", Name: "Diego Hypolito", ImageURL: "https://s2.glbimg.com/zMwedNYl83ucrGEep3QspGvC2NM=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/L/M/TWeMYUTx2BTlJM5qRKtQ/diego-bbb-25.png", IsActive: true},
		{ID: "diogo", Name: "Diogo Almeida", ImageURL: "https://s2.glbimg.com/G96s9uUh5NelnbCSCfXLXE6qoeQ=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/b/y/RwiHQzSkWIbm5YIHga0w/diogo-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "vilma", Name: "Vilma", ImageURL: "https://s2.glbimg.com/b5Q-1gz6YZZR2osc7Z6IHIgg0Qo=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/Q/B/prKIZiQAGkJPRtHrRirw/vilma-bbb-25.png", IsActive: true},
		{ID: "edilberto", Name: "Edilberto", ImageURL: "https://s2.glbimg.com/T2-nzU8RGQYWt1jWUGofUYwWkoE=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/l/5/P8dJ0BSPmTeCeeb0Caiw/edilberto-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "raissa", Name: "Raissa", ImageURL: "https://s2.glbimg.com/07z_KxTItCLUX9a9QerzK4RJYXE=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/D/t/raObCaTgA5niMPugBMKg/raissa-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "eva", Name: "Eva", ImageURL: "https://s2.glbimg.com/iWVO7h3QlGiV8BwD0RYDx7cEwxU=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/L/B/wM4kF4Tpy0SpX2sA4rwQ/eva-bbb-25.png", IsActive: true},
		{ID: "renata", Name: "Renata", ImageURL: "https://s2.glbimg.com/NWPDpEC0-wPrndUxzfLjoCqRUcw=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/t/r/zVRCCJQCivrP42Wnlstg/renata-bbb-25.png", Status: "líder", IsActive: true},
		{ID: "gabriel", Name: "Gabriel", ImageURL: "https://s2.glbimg.com/0xNq2yiP56tVmQTrsJugX9F16Ds=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/G/u/PtDQNWQvat18KX5MrbxQ/gabriel-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "maike", Name: "Maike", ImageURL: "https://s2.glbimg.com/kT69XDgS68cKcD2oQx11OBpwZFg=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/3/e/DcDKDsT1KFSELrDBP8CQ/maike-bbb-25.png", IsActive: true},
		{ID: "gracyanne", Name: "Gracyanne Barbosa", ImageURL: "https://s2.glbimg.com/-dBPW_G7xXmtTVTY4He-CsGqiR4=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/O/b/2aAkGqQVye0oLJBQNpjw/gracyanne-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "giovanna", Name: "Giovanna", ImageURL: "https://s2.glbimg.com/cCqbmUTyM5JkF81LA0FDA7UOc7U=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/W/8/lDhnWkT1G14vIqdGDA1Q/giovanna-bbb-25.png", Status: "eliminado", IsActive: false},
		{ID: "guilherme", Name: "Guilherme", ImageURL: "https://s2.glbimg.com/DmsApwFL9BbGa8mJVI38sFGOMVY=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/z/F/MAL0oiQWy522aXB9Q0tw/guilherme-bbb-25.png", IsActive: true},
		{ID: "joselma", Name: "Joselma", ImageURL: "https://s2.glbimg.com/kOXnDmx4ZRe9BKv-PI_tYdZutGM=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/a/l/UwBn2JQj2glsBZN4TyiA/joselma-bbb-25.png", IsActive: true},
		{ID: "joao-gabriel", Name: "João Gabriel", ImageURL: "https://s2.glbimg.com/L6FYUD9bMsw-P--MJZbDuhjudQQ=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/1/7/LlAxWeTiOwAmMwPnJAZw/joaogabriel-bbb-25.png", IsActive: true},
		{ID: "joao-pedro", Name: "João Pedro", ImageURL: "https://s2.glbimg.com/jXyWF4ADoBKr5iDoc1cVX1IC_dw=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/4/V/exCOZxTdy475FMuDRk3Q/joaopedro-bbb-25.png", IsActive: true},
		{ID: "vitoria", Name: "Vitória Strada", ImageURL: "https://s2.glbimg.com/PoantXfakW-hCaMT8vwfzWniQDM=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/6/r/RL6bRLR2yrvZTOHA0E7Q/vitoria-bbb-25.png", IsActive: true},
		{ID: "mateus", Name: "Mateus", ImageURL: "https://s2.glbimg.com/4dDnO_vHi9lRvQgckLqIB-cIaOc=/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/A/F/5evWSESmuY2k9WwG9rFg/mateus-bbb-25.png", Status: "eliminado", IsActive: false},
	}

	votingStatus = VotingStatus{
		IsEnabled: false,
	}

	votingHistory []VotingHistory
)

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

func startVoting(w http.ResponseWriter, r *http.Request) {
	log.Println("Iniciando nova votação")
	if r.Method != http.MethodPost {
		log.Printf("Método não permitido: %s", r.Method)
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var request struct {
		Participantes []string `json:"participantes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Printf("Erro ao decodificar requisição: %v", err)
		http.Error(w, "Erro ao decodificar requisição", http.StatusBadRequest)
		return
	}

	if len(request.Participantes) != 3 {
		log.Printf("Número incorreto de participantes: %d", len(request.Participantes))
		http.Error(w, "Deve selecionar exatamente 3 participantes", http.StatusBadRequest)
		return
	}

	log.Printf("Participantes selecionados para o paredão: %v", request.Participantes)
	votingStatus.IsEnabled = true
	votingStatus.StartTime = time.Now().Format(time.RFC3339)
	votingStatus.Participants = make([]Participant, 0)
	votingStatus.TotalVotes = 0

	for _, id := range request.Participantes {
		for _, p := range participants {
			if p.ID == id {
				votingStatus.Participants = append(votingStatus.Participants, Participant{
					ID:       p.ID,
					Name:     p.Name,
					ImageURL: p.ImageURL,
					Status:   p.Status,
					IsActive: p.IsActive,
					Votes:    0,
				})
				log.Printf("Participante adicionado ao paredão: %s", p.Name)
				break
			}
		}
	}

	w.WriteHeader(http.StatusOK)
	log.Println("Paredão iniciado com sucesso")
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

	log.Printf("Vencedor do paredão: %s com %d votos", winner.Name, winner.Votes)

	// Criar histórico
	history := VotingHistory{
		ID:           time.Now().Format("20060102150405"),
		StartTime:    votingStatus.StartTime,
		EndTime:      time.Now().Format(time.RFC3339),
		TotalVotes:   votingStatus.TotalVotes,
		Participants: votingStatus.Participants,
		Winner:       winner,
	}
	votingHistory = append(votingHistory, history)
	log.Printf("Histórico atualizado. Total de paredões: %d", len(votingHistory))

	// Atualizar status dos participantes
	for i := range participants {
		for _, p := range votingStatus.Participants {
			if participants[i].ID == p.ID {
				if p.ID != winner.ID {
					participants[i].Status = "eliminado"
					participants[i].IsActive = false
					log.Printf("Participante eliminado: %s", participants[i].Name)
				}
				break
			}
		}
	}

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

func vote(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Printf("Método não permitido: %s", r.Method)
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	if !votingStatus.IsEnabled {
		log.Println("Tentativa de votar em paredão inativo")
		http.Error(w, "Nenhuma votação em andamento", http.StatusBadRequest)
		return
	}

	var request struct {
		Participante string `json:"participante"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Printf("Erro ao decodificar voto: %v", err)
		http.Error(w, "Erro ao decodificar requisição", http.StatusBadRequest)
		return
	}

	log.Printf("Voto recebido para o participante: %s", request.Participante)

	for i := range votingStatus.Participants {
		if votingStatus.Participants[i].ID == request.Participante {
			votingStatus.Participants[i].Votes++
			votingStatus.TotalVotes++
			log.Printf("Voto registrado para %s. Total de votos: %d", 
				votingStatus.Participants[i].Name, 
				votingStatus.Participants[i].Votes)
			break
		}
	}

	w.WriteHeader(http.StatusOK)
	log.Printf("Total de votos no paredão: %d", votingStatus.TotalVotes)
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

	for i := range participants {
		if participants[i].ID == participantID {
			participants[i].Status = request.Status
			w.WriteHeader(http.StatusOK)
			return
		}
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

	for i := range participants {
		if participants[i].ID == participantID {
			participants[i].IsActive = request.IsActive
			w.WriteHeader(http.StatusOK)
			return
		}
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
	http.HandleFunc("/iniciar-votacao", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			handleOptions(w, r)
			return
		}
		corsMiddleware(startVoting)(w, r)
	})
	http.HandleFunc("/encerrar-votacao", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			handleOptions(w, r)
			return
		}
		corsMiddleware(endVoting)(w, r)
	})
	http.HandleFunc("/historico", corsMiddleware(getVotingHistory))
	http.HandleFunc("/votar", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			handleOptions(w, r)
			return
		}
		corsMiddleware(vote)(w, r)
	})

	log.Println("Rotas configuradas com sucesso")
	log.Fatal(http.ListenAndServe(":8080", nil))
} 