import React, { useState, useEffect } from 'react';
import './FormBuilder.css';

const FormBuilder = () => {
  const [showModal, setShowModal] = useState(false);
  const [fields, setFields] = useState([]);
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [savedForms, setSavedForms] = useState([]);

  useEffect(() => {
    fetchForms();
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleAddField = () => {
    if (fieldName.trim() === '') return;
    const newField = { name: fieldName, type: fieldType };
    setFields(prevFields => [...prevFields, newField]);
    setFieldName('');
    setFieldType('text');
    closeModal();
  };

  const handleDeleteField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1000/api/forms', {
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
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchForms = async () => {
    try {
      const response = await fetch('http://localhost:1000/api/forms');
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
      const response = await fetch(`http://localhost:1000/api/forms/${id}`, {
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
    <div className="form-builder">
      <h2>Form Builder</h2>
      <button onClick={openModal}>Create Form</button>
      <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <h3>Add Field</h3>
          <input
            type="text"
            placeholder="Field Name"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
          <select
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="address">Address</option>
            <option value="gender">Gender</option>
            <option value="date">Date</option>
            <option value="checkbox">Checkbox</option>
          </select>
          <button onClick={handleAddField}>Add Field</button>
        </div>
      </div>
      <div className="form-preview">
        <h3>Form Preview</h3>
        <form>
          {fields.map((field, index) => (
            <div className="form-field" key={index}>
              <label>{field.name}</label>
              {field.type === 'title' ? (
                <select>
                  <option>Mr.</option>
                  <option>Miss</option>
                  <option>Mrs.</option>
                  <option>Dr.</option>
                </select>
              ) : field.type === 'gender' ? (
                <select>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              ) : field.type === 'date' ? (
                <input type="date" />
              ) : field.type === 'checkbox' ? (
                <input type="checkbox" />
              ) : (
                <input type={field.type} />
              )}
              <button onClick={() => handleDeleteField(index)}>Delete</button>
            </div>
          ))}
        </form>
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Create Form</button>
      </form>
      <div>
        <h3>Saved Forms</h3>
        {savedForms.length > 0 && savedForms.map((form, index) => (
          <div key={index}>
            <h4>{form.name}</h4> {/* Assuming your form object has a 'name' property */}
            <form>
              {form.fields && form.fields.map((field, fieldIndex) => (
                <div className="form-field" key={fieldIndex}>
                  <label>{field.name}</label>
                  {/* Render input/select/checkbox based on field.type */}
                  {field.type === 'title' ? (
                    <select>
                      <option>Mr.</option>
                      <option>Miss</option>
                      <option>Mrs.</option>
                      <option>Dr.</option>
                    </select>
                  ) : field.type === 'gender' ? (
                    <select>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  ) : field.type === 'date' ? (
                    <input type="date" />
                  ) : field.type === 'checkbox' ? (
                    <input type="checkbox" />
                  ) : (
                    <input type={field.type} />
                  )}
                </div>
              ))}
            </form>
            <button onClick={() => handleDeleteForm(form._id)}>Delete Form</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormBuilder;
