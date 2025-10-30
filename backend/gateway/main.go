package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "ok")
	})
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Gateway received request: " + r.URL.Path)
	})
	log.Println("Gateway HTTP listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
