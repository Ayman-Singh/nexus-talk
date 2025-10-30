package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
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
	mux.HandleFunc("/register", registerHandler)
	mux.HandleFunc("/login", loginHandler)
	mux.HandleFunc("/profile/", profileHandler)
	log.Println("Identity service listening on :8081 (CORS enabled)")
	log.Fatal(http.ListenAndServe(":8081", withCORS(mux)))
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	var body map[string]interface{}
	json.NewDecoder(r.Body).Decode(&body)
	w.WriteHeader(201)
	fmt.Fprintln(w, `{ "id": "demo-user-id" }`)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var body map[string]interface{}
	json.NewDecoder(r.Body).Decode(&body)
	fmt.Fprintln(w, `{ "token": "demo.jwt.token" }`)
}

func profileHandler(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/profile/")
	resp := map[string]string{"id": id, "username": "demo", "display_name": "Demo User", "bio": "demo bio"}
	json.NewEncoder(w).Encode(resp)
}
