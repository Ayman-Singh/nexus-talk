package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"
)

type Msg struct {
	ID      int       `json:"id"`
	From    string    `json:"from"`
	To      string    `json:"to"`
	Content string    `json:"content"`
	At      time.Time `json:"at"`
}

var (
	all   []Msg
	m     sync.Mutex
	msgID int
)

func withCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		h.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/send", sendHandler)
	mux.HandleFunc("/inbox", inboxHandler)
	log.Println("Messaging w/ memory demo, CORS enabled on :8082")
	log.Fatal(http.ListenAndServe(":8082", withCORS(mux)))
}

func sendHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(405)
		return
	}
	var body struct {
		From, To, Content string
	}
	json.NewDecoder(r.Body).Decode(&body)
	m.Lock()
	msgID++
	mMsg := Msg{ID: msgID, From: body.From, To: body.To, Content: body.Content, At: time.Now()}
	all = append(all, mMsg)
	m.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mMsg)
}

func inboxHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(405)
		return
	}
	user := r.URL.Query().Get("user_id")
	msgs := []Msg{}
	m.Lock()
	for _, msg := range all {
		if msg.To == user || msg.From == user {
			msgs = append(msgs, msg)
		}
	}
	m.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(msgs)
}
