import { useState } from "react";

function ProjectForm() {
  const [formData, setFormData] = useState(
    { projectName: '', projectDescription: '', contacts: [], projectUrl: '', projectTopics: [], licenses: []})

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

    try {
      const response = await fetch('http://localhost:3001/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonFormData,
      });
  
      if (response.ok) {
        console.log('Data submitted successfully');
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
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
        Project URL:
        <input
          type="text"
          name="projectUrl"
          value={formData.projectUrl}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ProjectForm;