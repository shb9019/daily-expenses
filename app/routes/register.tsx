import { ActionFunction, LinksFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import authStylesUrl from "~/styles/auth.css";
import { badRequest } from "~/utils";
import { db } from "~/utils/db.server";
import { createUserSession, getUserId, register } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: authStylesUrl,
    },
  ];
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string;
    password: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  if (
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const userExists = await db.user.findFirst({
    where: { username },
  });
  if (userExists) {
    return badRequest({
      fields,
      formError: `User with username ${username} already exists`,
    });
  }

  const user = await register({ username, password });
  return createUserSession(user.id, "/expenses");
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId !== null) {
    return redirect("/expenses");
  }

  return null;
};

export default function Register() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="auth-container">
      <form method="post">
        <h2>Register</h2>
        <div>
          <label htmlFor="username">
            <b>Username</b>
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            name="username"
            required
            defaultValue={actionData?.fields?.username}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.username) || undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.username ? "username-error" : undefined
            }
          />
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
            defaultValue={actionData?.fields?.password}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.password) || undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.password ? "password-error" : undefined
            }
          />
        </div>
        <div>
          {actionData?.fieldErrors?.username ? (
            <p
              className="form-validation-error"
              role="alert"
              id="username-error"
            >
              {actionData.fieldErrors.username}
            </p>
          ) : null}
          {actionData?.fieldErrors?.password ? (
            <p
              className="form-validation-error"
              role="alert"
              id="password-error"
            >
              {actionData.fieldErrors.password}
            </p>
          ) : null}

          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
