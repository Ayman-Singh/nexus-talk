package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/messages", messagesHandler)
	mux.HandleFunc("/threads", threadsHandler)
	log.Println("Messaging service listening on :8082")
	log.Fatal(http.ListenAndServe(":8082", mux))
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
