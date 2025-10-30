import React from "react";

export default function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <label><input type="checkbox"/> Enable notifications</label><br/>
      <label><input type="checkbox"/> Dark mode</label><br/>
      <label><input type="checkbox"/> Stealth mode</label><br/>
      <label><input type="checkbox"/> Block downloads</label><br/>
      <div style={{marginTop:20, color:"#888"}}>Save/real logic not wired up (stub).</div>
    </div>
  );
}
