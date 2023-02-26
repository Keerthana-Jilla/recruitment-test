import React, { useEffect, useState } from 'react'

export default function UpdateEmployeeForm(props) {
    const initialFormData = {
        EmpName: props.empInfo.name,
        EmpValue: props.empInfo.value
    };

    const [formData, setFormData] = useState({
        EmpName: props.empInfo.name,
        EmpValue: props.empInfo.value
    });

    useEffect(() => {
        setFormData(initialFormData);
    }, [props]);

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

            const updateEmployee = {
                id: props.empInfo.id,
                name: formData.EmpName,
                value: formData.EmpValue
            };

            fetch('api/Employees/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateEmployee)
            })
                .then(response => response.json())
                .then(res => {
                    if (res != null && res != "") {
                        alert("Updated Employee Successfully");
                        props.setRowsUpdated(res);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    alert(error);
                });

            props.onEmployeeUpdated(updateEmployee);
        }
    };

    return (
        <div className="divChild">
            <div className="divEmpForm">
                <form>
                    <h4>Update Employee</h4>
                    <table className="tbEmpForm"><tbody>
                        <tr>
                            <td><label >Employee Name</label></td>
                            <td><input value={formData.EmpName} name="EmpName" type="text" onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><label>Employee Value</label></td>
                            <td><input value={formData.EmpValue} name="EmpValue" type="text" onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><button onClick={handleSubmit} CssClass="btn btn-primary">Update</button>
                                <button onClick={() => props.onEmployeeUpdated(null)} CssClass="btn btn-primary">Cancel</button></td>
                        </tr>
                    </tbody></table>
                </form>
            </div>
        </div>
    );
}
