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
	mux.HandleFunc("/media", mediaHandler)
	mux.HandleFunc("/media/", mediaSubHandler)
	log.Println("Media service listening on :8084")
	log.Fatal(http.ListenAndServe(":8084", mux))
}

func mediaHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(201)
		fmt.Fprintln(w, `{ "id": "media-sample" }`)
		return
	}
	ownerID := r.URL.Query().Get("owner_id")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"media": []string{"file1.jpg", "file2.mp4 (owner:" + ownerID + ")"},
	})
}

func mediaSubHandler(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/media/"), "/")
	if len(parts) > 1 && parts[1] == "thumbnail" {
		w.WriteHeader(200)
		fmt.Fprintln(w, "Thumbnail binary (stub)")
		return
	}
	if len(parts) > 1 && parts[1] == "block_download" {
		w.WriteHeader(204)
		return
	}
}
