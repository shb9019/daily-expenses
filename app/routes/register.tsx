import type { LinksFunction } from "@remix-run/node";
import authStylesUrl from "~/styles/auth.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: authStylesUrl,
    },
  ];
};

export default function Register() {
  return (
    <div className="auth-container">
      <form method="post">
        <h2>Register</h2>
        <div>
          <label htmlFor="username">
            <b>Username</b>
          </label>
          <input type="text" placeholder="Enter Username" name="username" required />
        </div>
        <div>
          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            required
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
