package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
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
	mux.HandleFunc("/messages", messagesHandler)
	mux.HandleFunc("/threads", threadsHandler)
	log.Println("Messaging service listening on :8082 (CORS enabled)")
	log.Fatal(http.ListenAndServe(":8082", withCORS(mux)))
}

func messagesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(201)
		fmt.Fprintln(w, `{ "msg_id": "demo" }`)
		return
	}

	q := r.URL.Query()
	threadID := q.Get("thread_id")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"messages": []string{"stub msg 1 (thread "+threadID+")", "stub msg 2"},
	})
}

func threadsHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(201)
	fmt.Fprintln(w, `{ "thread_id": "dummy-thread" }`)
}
