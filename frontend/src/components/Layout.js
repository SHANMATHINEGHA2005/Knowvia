import React from "react";
import "../index.css";

function Layout({ children, darkMode, sidebarContent, topbarContent }) {
  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>
      <aside className="sidebar">{sidebarContent}</aside>
      <div className="main-panel">
        <header className="topbar">{topbarContent}</header>
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
