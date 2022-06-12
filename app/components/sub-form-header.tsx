import { Link } from "@remix-run/react";

export default function SubFormHeader({ title }: { title: string }) {
  return (
    <div className="sub-form-header">
      <h2>{title}</h2>
      <Link to="..">
        <p>&#10006;</p>
      </Link>
    </div>
  );
}
