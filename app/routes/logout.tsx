import { LoaderFunction, redirect } from "@remix-run/node";
import { logout } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  return logout(request);
};

export default function Logout() {
  return null;
}
