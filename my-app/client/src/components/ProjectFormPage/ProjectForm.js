import { useState } from "react";
import isUrl from "is-url";

function ProjectForm() {
  const [formData, setFormData] = useState(
    { projectName: '', projectDescription: '', email: '', projectUrl: '', projectTopics: [], licenses: []})
  
  const [urlError, setUrlError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jsonFormData = JSON.stringify(formData);

    let isValid = true;

    if (!formData.projectUrl) {
      setUrlError("Please enter a project URL");
    } else {
      const projectUrlCheck = isUrl(formData.projectUrl);

      if (!projectUrlCheck) {
        setUrlError("Project URL is not in a valid format");
        isValid = false;
      } else {
        setUrlError("");
      }
    }
    
    
    if (!formData.email) {
      setEmailError("Please enter the primary contact's email");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailCheck = emailRegex.test(formData.email);
    
      if (!emailCheck) {
        setEmailError("Contact email is not a valid email");
        isValid = false;
      } else {
        setEmailError("");
      }
    }
    

    if (isValid) {
      const response = await fetch('http://localhost:3001/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonFormData,
      });

      if (response.ok) {
        setSuccessMessage("Project submitted successfully!");
      } else {
        setSuccessMessage("Something went wrong...please try again.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
          />
        </label>

        <label>
          Project Description:
          <input
            type="text"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
          />
        </label>

        <label>
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        {emailError && <div className="urlError" style={{color: 'red'}}> {emailError} </div>}

        <label>
          Project URL:
          <input
            type="text"
            name="projectUrl"
            value={formData.projectUrl}
            onChange={handleChange}
          />
        </label>
        {urlError && <div className="urlError" style={{color: 'red'}}> {urlError} </div>}

        <button type="submit">Submit</button>
      </form>

      {successMessage && <p> {successMessage} </p>}
    </div>
  );
}

export default ProjectForm;