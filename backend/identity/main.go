package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"
)

var (
	userPresence = map[string]struct{
		Online bool
		LastSeen time.Time
	}{}}
	presenceMux sync.Mutex
	userPrivacy = map[string]map[string]bool{}
	privacyMux sync.Mutex
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
	mux.HandleFunc("/presence", presenceHandler)
	mux.HandleFunc("/privacy", privacyHandler)
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

// /presence?user_id=:id (GET) or POST body {user_id, online}
func presenceHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method=="GET"{
		user:=r.URL.Query().Get("user_id")
		presenceMux.Lock()
		p,userOk:=userPresence[user]
		presenceMux.Unlock()
		j:=make(map[string]interface{})
		j["online"] = userOk && p.Online
		j["last_seen"] = p.LastSeen.Format(time.RFC3339)
		json.NewEncoder(w).Encode(j); return
	} else if r.Method=="POST"{
		var req struct{UserID string; Online bool}
		json.NewDecoder(r.Body).Decode(&req)
		presenceMux.Lock()
		userPresence[req.UserID]=struct{
			Online bool
			LastSeen time.Time
		}{Online:req.Online, LastSeen:time.Now()}
		presenceMux.Unlock()
		w.Write([]byte(`{"ok":true}`)); return
	} else { w.WriteHeader(405); return }
}
// /privacy?user_id= (GET), POST body {user_id, settings: {…}}
func privacyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method=="GET"{
		user:=r.URL.Query().Get("user_id")
		privacyMux.Lock()
		settings,ok:=userPrivacy[user]
		privacyMux.Unlock()
		if !ok {
			settings=map[string]bool{"profile_visible":true, "last_seen_visible":true, "read_receipts":true}
		}
		json.NewEncoder(w).Encode(settings); return
	} else if r.Method=="POST"{
		var req struct{UserID string; Settings map[string]bool}
		json.NewDecoder(r.Body).Decode(&req)
		privacyMux.Lock(); userPrivacy[req.UserID]=req.Settings; privacyMux.Unlock()
		w.Write([]byte(`{"ok":true}`)); return
	} else { w.WriteHeader(405); return }
}
