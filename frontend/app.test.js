// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock env variables that Vite uses
vi.stubGlobal("import", {
    meta: {
        env: {
            VITE_API_BASE_URL: "http://127.0.0.1:3000",
            VITE_DEMO_MODE: "false"
        }
    }
});

import {
    state,
    books,
    render,
    setRoute,
    setRole,
    app
} from "./app.js";

describe("Frontend App State and Routing", () => {
    beforeEach(() => {
        // Reset basic state fields
        state.route = "student-dashboard";
        state.role = "student";
        state.search = "";
        state.error = "";
        state.toast = "";
        state.notifications = [
            { id: "notif-1", title: "Test Notification", isRead: false, createdAt: "2026-06-28T00:00:00.000Z" }
        ];
    });

    it("should initialize state values correctly", () => {
        expect(state.route).toBe("student-dashboard");
        expect(state.role).toBe("student");
        expect(state.notifications.length).toBe(1);
    });

    it("should change route via setRoute", () => {
        setRoute("catalog");
        expect(state.route).toBe("catalog");
        expect(state.sidebarOpen).toBe(false);
    });

    it("should change role and redirect via setRole", () => {
        setRole("admin");
        expect(state.role).toBe("admin");
        expect(state.route).toBe("admin-dashboard");
    });

    it("should render catalog markup inside the app element", () => {
        setRoute("catalog");
        render();
        expect(app.innerHTML).toContain("Katalog Buku");
        expect(app.innerHTML).toContain("Cari berdasarkan");
    });

    it("should render empty state when search matches no books", () => {
        setRoute("catalog");
        state.search = "buku-yang-tidak-ada-di-mana-pun";
        render();
        expect(app.innerHTML).toContain("Buku tidak ditemukan");
    });

    it("should render error panel when state.error is set", () => {
        setRoute("catalog");
        state.error = "Koneksi ke server terputus";
        render();
        expect(app.innerHTML).toContain("Terjadi Kesalahan");
        expect(app.innerHTML).toContain("Koneksi ke server terputus");
        expect(app.innerHTML).toContain("Coba Lagi");
    });

    it("should render unread notifications count badge", () => {
        setRoute("notifications");
        render();
        expect(app.innerHTML).toContain("1 notifikasi belum dibaca");
    });
});
