import React, { useState } from 'react';
import './index.css';
import data from './config';
import 'react-phone-input-2/lib/style.css'; // Import CSS for react-phone-input-2
import PhoneInput from 'react-phone-input-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [finalFormData, setFinalFormData] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    address1: '',
    address2: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.first_name.length < 5 || formData.last_name.length < 5) {
      alert('First name and last name must be at least 5 characters long.');
      return;
    }

    if (editingIndex === -1) {
      setFinalFormData((prev) => {
        let formData2 = { ...formData, state: state, district: district, id: finalFormData.length };
        return [...prev, { ...formData2 }];
      });
    } else {
      const updatedData = [...finalFormData];
      updatedData[editingIndex] = { ...formData, state: state, district: district, id: editingIndex };
      setFinalFormData(updatedData);
      setEditingIndex(-1);
    }

    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      mobile: '',
      address1: '',
      address2: '',
    });
    setState('');
    setDistrict('');
  };

  const handleEdit = (index) => {
    const editData = finalFormData[index];
    setFormData({
      first_name: editData.first_name,
      last_name: editData.last_name,
      email: editData.email,
      mobile: editData.mobile,
      address1: editData.address1,
      address2: editData.address2,
    });
    setState(editData.state);
    setDistrict(editData.district);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedData = finalFormData.filter((_, i) => i !== index);
    setFinalFormData(updatedData);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = finalFormData.filter((user) =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMobileChange = (value) => {
    // value will contain the formatted mobile number with the country code
    setFormData({
      ...formData,
      mobile: value,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Id:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Mobile:</label>
          <PhoneInput
            country={'us'} // Default country (optional)
            value={formData.mobile}
            onChange={handleMobileChange}
            inputProps={{
              name: 'mobile',
              id: 'mobile',
              required: true,
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address1">Address 1:</label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address2">Address 2:</label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">State:</label>
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value);
            }}
          >
            <option value="">Select State</option>
            {data.map((item, index) => {
              return (
                <option key={index} value={item.state}>
                  {item.state}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="district">District:</label>
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
            }}
          >
            {state?.length &&
              data.filter((states) => states.state === state)[0].districts?.map((item, index) => {
                return <option key={index} value={item}>{item}</option>;
              })}
          </select>
        </div>

        <div className="form-group">
          <input type="submit" value={editingIndex === -1 ? 'Create' : 'Update'} />
        </div>
      </form>

      <div className="search-container">
        <label htmlFor="search">Search by First Name:</label>
        <input
          type="text"
          id="search"
          name="search"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Enter first name"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>State</th>
            <th>District</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((val, index) => {
            return (
              <tr key={index}>
                <td>{val.first_name}</td>
                <td>{val.last_name}</td>
                <td>{val.state}</td>
                <td>{val.district}</td>
                <td>{val.mobile}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button onClick={() => handleDelete(index)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default App;
