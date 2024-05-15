import React, { useState, useEffect } from 'react';
import './FormBuilder.css';

// Navbar Component
const Navbar = ({ openModal, handleAddField, handleSubmit, isCreatingForm }) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');

  const handleFieldChange = (e) => {
    setFieldName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setFieldType(e.target.value);
  };

  const handleAddFieldClick = () => {
    if (fieldName.trim() === '') return;
    handleAddField(fieldName, fieldType);
    setFieldName('');
    setFieldType('text');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1>Form Builder</h1>
        <div className="button-container">
          <button className="create-button" onClick={openModal}>{isCreatingForm ? "Cancel" : "Create Form"}</button>
          {isCreatingForm && (
            <>
              <input
                className="field-name-input"
                type="text"
                placeholder="Field Name"
                value={fieldName}
                onChange={handleFieldChange}
              />
              <select className="field-type-select" value={fieldType} onChange={handleTypeChange}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="address">Address</option>
                <option value="email">Email</option>
                <option value="phone">Phone Number</option>
                <option value="date">Date</option>
                <option value="checkbox">Checkbox</option>
                <option value="textarea">Textarea</option>
                <option value="gender">Gender</option> {/* Added gender field */}
              </select>
              <button className="add-field-button" onClick={handleAddFieldClick}>Add Field</button>
            </>
          )}
          {isCreatingForm && <button className="save-form-button" onClick={handleSubmit}>Save Form</button>}
        </div>
      </div>
    </nav>
  );
};

// FormBuilder Component
const FormBuilder = () => {
  const [showModal, setShowModal] = useState(false);
  const [fields, setFields] = useState([]);
  const [savedForms, setSavedForms] = useState([]);
  const [isCreatingForm, setIsCreatingForm] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const openModal = () => {
    setShowModal(true);
    setIsCreatingForm(!isCreatingForm);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsCreatingForm(false);
  };

  const handleAddField = (name, type) => {
    const newField = { name, type };
    setFields(prevFields => [...prevFields, newField]);
  };

  const handleDeleteField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://form-builder-backend-igjn.onrender.com/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      });
      if (response.ok) {
        console.log('Form submitted successfully');
        fetchForms();
        setFields([]);
        setIsCreatingForm(false);
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchForms = async () => {
    try {
      const response = await fetch('https://form-builder-backend-igjn.onrender.com/api/forms');
      if (response.ok) {
        const formData = await response.json();
        setSavedForms(formData);
      } else {
        console.error('Failed to fetch forms');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteForm = async (id) => {
    try {
      const response = await fetch(`https://form-builder-backend-igjn.onrender.com/api/forms/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Form deleted successfully');
        fetchForms();
      } else {
        console.error('Failed to delete form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Navbar 
        openModal={openModal} 
        handleAddField={handleAddField} 
        handleSubmit={handleSubmit}
        isCreatingForm={isCreatingForm}
      />
      {savedForms.length > 0 && (
        <div className="saved-forms">
          <h3>Saved Forms</h3>
          {savedForms.map((form, index) => (
            <div className="saved-form" key={index}>
              <h4>{form.name}</h4>
              <form>
                {form.fields && form.fields.map((field, fieldIndex) => (
                  <div className="form-field" key={fieldIndex}>
                    <label>{field.name}</label>
                    {field.type === 'gender' ? (
                      <select>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    ) : field.type === 'date' ? (
                      <input type="date" />
                    ) : field.type === 'checkbox' ? (
                      <input type="checkbox" />
                    ) : field.type === 'textarea' ? (
                      <textarea />
                    ) : (
                      <input type={field.type} />
                    )}
                  </div>
                ))}
              </form>
              <button className="delete-form-button" onClick={() => handleDeleteForm(form._id)}>Delete Form</button>
            </div>
          ))}
        </div>
      )}
      {isCreatingForm && (
        <div className="form-builder">
          <div className="form-preview">
            <h3>Form Preview</h3>
            <form>
              {fields.map((field, index) => (
                <div className="form-field" key={index}>
                  <label>{field.name}</label>
                  {field.type === 'gender' ? (
                    <select>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  ) : field.type === 'date' ? (
                    <input type="date" />
                  ) : field.type === 'checkbox' ? (
                    <input type="checkbox" />
                  ) : field.type === 'textarea' ? (
                    <textarea />
                  ) : (
                    <input type={field.type} />
                  )}
                  <button className="delete-field-button" onClick={() => handleDeleteField(index)}>Delete</button>
                </div>
              ))}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
