import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-hairline)",
          borderRadius: 10,
          padding: 28,
        }}
      >
        <h1
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.015em",
          }}
        >
          Admin sign in
        </h1>
        <p style={{ fontSize: 13, marginTop: 5, marginBottom: 20, color: "var(--text-secondary)" }}>
          Restricted to authorized accounts.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
