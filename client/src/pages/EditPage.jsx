import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm.jsx";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { getApplicationById, updateApplication } from "../services/api.js";

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);

  const [serverError, setServerError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Load the existing application
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingApp(true);
      setLoadError(null);
      try {
        const res = await getApplicationById(id);
        if (!cancelled) setApplication(res.data);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || "Failed to load application");
      } finally {
        if (!cancelled) setLoadingApp(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  async function handleSubmit(values) {
    setServerError(null);
    setFieldErrors({});
    try {
      await updateApplication(id, values);
      navigate(`/applications/${id}`);
    } catch (err) {
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      } else {
        setServerError(err.message || "Failed to update application");
      }
    }
  }

  if (loadingApp) return <Spinner message="Loading application…" />;
  if (loadError)
    return (
      <div className="page page-narrow">
        <ErrorMessage message={loadError} />
        <Link to="/applications" className="btn btn-secondary" style={{ marginTop: "1rem" }}>
          ← Back to Applications
        </Link>
      </div>
    );

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <h1 className="page-title">Edit Application</h1>
        <Link to={`/applications/${id}`} className="btn btn-secondary">
          ← Back
        </Link>
      </div>
      <ApplicationForm
        initialValues={application}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        serverError={serverError}
        fieldErrors={fieldErrors}
      />
    </div>
  );
}
