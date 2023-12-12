import { useState } from "react";
import isUrl from "is-url";
import Select from 'react-select';
import './ProjectForm.css';

function ProjectForm() {
  const [formData, setFormData] = useState({
    projectName: '',
    projectAbstract: '',
    projectUrl: '',
    contacts: [{ name: '', email: '' }],
    projectAreas: [],
    licenses: [],
    guidelinesUrl: ''
  });
  
  const projectAreaOptions = [
    { value: 'ai', label: 'Artifical Intelligence' },
    { value: 'bioscience', label: 'Bioscience' },
    { value: 'compsci', label: 'Computer Science' },
    { value: 'hpc', label: 'High Performance Computing' },
    { value: 'graphics', label: 'Computer Graphics' },
    { value: 'robotics', label: 'Robotics' },
    { value: 'hci', label: 'Human-Computer Interaction' }
  ];
  const licenseOptions = [
    { value: 'mit', label: 'MIT License' },
    { value: 'apache', label: 'Apache License 2.0' },
    { value: 'isc', label: 'ISC License' },
    { value: 'bsd-3', label: 'BSD 3-Clause "New" or "Revised" License' },
  ];

  const [errors, setErrors] = useState({});

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const newContacts = [...formData.contacts];
    newContacts[index][name] = value;
    setFormData({ ...formData, contacts: newContacts });
  };

  const addContact = () => {
    const newContacts = [...formData.contacts, { name: '', email: '' }];
    if (newContacts.length <= 5) {
      setFormData({ ...formData, contacts: newContacts });
    }
  };

  const removeContact = (index) => {
    const newContacts = [...formData.contacts];
    newContacts.splice(index, 1);
    setFormData({ ...formData, contacts: newContacts });
  };

  const handleSelectChange = (name, selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setFormData({ ...formData, [name]: values });
  };

  const validateAllFields = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    newErrors.projectName = formData.projectName ? '' : 'Please enter a project name';
    newErrors.projectAbstract = formData.projectAbstract ? '' : 'Please enter an abstract on the project';
    
    newErrors.projectUrl = formData.projectUrl ? (isUrl(formData.projectUrl) ? '' : 'URL is not in a valid format') : 'Please enter a URL to the project page';
    newErrors.guidelinesUrl = formData.guidelinesUrl ? (isUrl(formData.guidelinesUrl) ? '' : 'URL is not in a valid format') : 'Please enter a URL to the project contribution guidelines';
    
    newErrors.contacts = formData.contacts.map(contact => {
      let contactError = {};
      contactError.name = contact.name ? '' : 'Please enter a name';
      contactError.email = contact.email ? (emailRegex.test(contact.email) ? '' : 'Contact email is not in valid email format') : 'Please enter an email';
      return contactError;
    });

    if (formData.contacts.every(contact => !contact.name && !contact.email)) {
      newErrors.contacts = [{ name: 'Please enter at least one contact\'s information' }];
    }

    newErrors.projectAreas = formData.projectAreas.length > 0 ? '' : 'Please choose at least one project area';
    newErrors.licenses = formData.licenses.length > 0 ? '' : 'Please choose at least one license';

    setErrors(newErrors);

    const allFieldsValid = Object.values(newErrors).every(error => {
      if (Array.isArray(error)) {
        return error.every(contactError => 
          Object.values(contactError).every(value => !value)
        );
      }

      return !error;
    })

    return allFieldsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jsonFormData = JSON.stringify(formData);
    const isFormValid = validateAllFields();
    
    if (isFormValid) {
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
    } else {
      setSuccessMessage("");
    }
  };

  return (
    <div className="form-container">
      <h1>Open Source Project Information Form</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Enter the project's name"
          />
        </label>
        {errors.projectName && <div className="error">{errors.projectName}</div>}

        <label>
          Project Abstract:
          <input
            type="text"
            name="projectAbstract"
            value={formData.projectAbstract}
            onChange={handleChange}
            placeholder="Enter an abstract on the project"
          />
        </label>
        {errors.projectAbstract && <div className="error">{errors.projectAbstract}</div>}

        <label>
          Project URL:
          <input
            type="text"
            name="projectUrl"
            value={formData.projectUrl}
            onChange={handleChange}
            placeholder="Enter a valid URL to the project page"
          />
        </label>
        {errors.projectUrl && <div className="error">{errors.projectUrl}</div>}


        <div className="contacts-section">
          <label>
            Primary Contact(s)
          </label>
          {formData.contacts.map((contact, index) => (
            <div key={index} className="contact-input">
              <input
                type="text" 
                name="name" 
                value={contact.name} 
                onChange={(e) => handleContactChange(index, e)} 
                placeholder="Enter the contact's name"
              />
              {errors.contacts && errors.contacts[index] && errors.contacts[index].name && <div className="error">{errors.contacts[index].name}</div>}

              <input
                type="text" 
                name="email" 
                value={contact.email} 
                onChange={(e) => handleContactChange(index, e)} 
                placeholder="Enter the contact's email"
              />
              {errors.contacts && errors.contacts[index] && errors.contacts[index].email && <div className="error">{errors.contacts[index].email}</div>}
              
              {index > 0 && (
                <button type="button" onClick={() => removeContact(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}

          {formData.contacts.length < 5 && (
            <button type="button" onClick={addContact}>
              Add new Contact
            </button>
          )}
        </div>
        
        <label>
          Project Areas
        </label>
        <Select
          isMulti
          name="projectAreas"
          options={projectAreaOptions}
          className="select-container"
          classNamePrefix="select"
          onChange={(selectedOptions) => handleSelectChange('projectAreas', selectedOptions)} 
        />
        {errors.projectAreas && <div className="error">{errors.projectAreas}</div>}

        <label>
          Project License(s)
        </label>
        <Select
          isMulti
          name="licenses"
          options={licenseOptions}
          className="select-container"
          classNamePrefix="select"
          onChange={(selectedOptions) => handleSelectChange('licenses', selectedOptions)} 
        />
        {errors.licenses && <div className="error">{errors.licenses}</div>}

        <label>
          Community Contribution Guidelines URL:
          <input
            type="text"
            name="guidelinesUrl"
            value={formData.guidelinesUrl}
            onChange={handleChange}
            placeholder="Enter a valid URL to the community contribution guidelines"
          />
        </label>
        {errors.guidelinesUrl && <div className="error">{errors.guidelinesUrl}</div>}
        
        <button type="submit">Submit</button>

        {successMessage && <p> {successMessage} </p>}
      </form>
    </div>
  );
}

export default ProjectForm;