package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/register", registerHandler)
	mux.HandleFunc("/login", loginHandler)
	mux.HandleFunc("/profile/", profileHandler)
	log.Println("Identity service listening on :8081")
	log.Fatal(http.ListenAndServe(":8081", mux))
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
