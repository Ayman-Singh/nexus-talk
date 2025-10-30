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
	mux.HandleFunc("/channels", channelsHandler)
	mux.HandleFunc("/channels/", channelSubHandler)
	log.Println("Channels service listening on :8083")
	log.Fatal(http.ListenAndServe(":8083", mux))
}

func channelsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(201)
		fmt.Fprintln(w, `{ "id": "ch-demo"}`)
		return
	}
	json.NewEncoder(w).Encode(map[string]interface{}{
		"channels": []string{"general", "random"},
	})
}

func channelSubHandler(w http.ResponseWriter, r *http.Request) {
	uri := r.URL.Path
	parts := strings.Split(strings.TrimPrefix(uri, "/channels/"), "/")
	if len(parts) > 1 && parts[1] == "join" {
		w.WriteHeader(204)
		return
	}
	if len(parts) > 1 && parts[1] == "schedule" {
		w.WriteHeader(201)
		fmt.Fprintln(w, `{ "scheduled": true }`)
		return
	}
}
