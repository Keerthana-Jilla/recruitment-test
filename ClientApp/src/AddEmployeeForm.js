import React, { useState } from 'react';


export default function AddEmployeeForm(props) {
    const initialFormData = {
        EmpName: "",
        EmpValue: 0
    };

    const [formData, setFormData] = useState(initialFormData);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.EmpName == "") {
            alert("Name must be filled out");
            return false;
        }
        else if (isNaN(formData.EmpValue) || formData.EmpValue < 1) {
            alert("Number should not be empty and must be greater than zero");
            return false;
        }
        else {
            const NewEmployee = {
                name: formData.EmpName,
                value: formData.EmpValue
            };

            fetch('api/Employees/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(NewEmployee)
            })
                .then(response => response.json())
                .then(res => {
                    if (res != null && res != "") {
                        alert("Added Employee Successfully");
                        props.setRowsUpdated(res);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    alert(error);
                });

            props.onEmployeeAdded(NewEmployee);
        }
    };

    return (
        <div className="divChild">
            <div className="divEmpForm">
                <form>
                    <h4>Create new Employee</h4>
                    <table className="tbEmpForm"><tbody>
                        <tr>
                            <td><label>Employee Name</label></td>
                            <td> <input value={formData.EmpName} name="EmpName" type="text" onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td> <label>Employee Value</label></td>
                            <td> <input value={formData.EmpValue} name="EmpValue" type="number" onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><button onClick={handleSubmit} CssClass="btn btn-primary">Submit</button>
                                <button onClick={() => props.onEmployeeAdded(null)} CssClass="btn btn-primary">Cancel</button></td>
                        </tr>
                    </tbody></table>
                </form>
            </div>
        </div>
    );
}
