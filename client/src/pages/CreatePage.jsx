import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm.jsx";
import { createApplication } from "../services/api.js";

export default function CreatePage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(values) {
    setServerError(null);
    setFieldErrors({});
    try {
      const res = await createApplication(values);
      // Navigate to the new application's detail page on success
      navigate(`/applications/${res.data._id}`);
    } catch (err) {
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      } else {
        setServerError(err.message || "Failed to create application");
      }
    }
  }

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <h1 className="page-title">New Application</h1>
        <Link to="/applications" className="btn btn-secondary">
          ← Back
        </Link>
      </div>
      <ApplicationForm
        onSubmit={handleSubmit}
        submitLabel="Create Application"
        serverError={serverError}
        fieldErrors={fieldErrors}
      />
    </div>
  );
}
