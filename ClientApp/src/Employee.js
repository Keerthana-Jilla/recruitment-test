import React, { Component, useState, useEffect } from 'react';
import Pagination from './Pagination';
import AddEmployeeForm from "./AddEmployeeForm";
import UpdateEmployeeForm from './UpdateEmployeeForm';

function Employee() {

    // To hold the actual data
    const [empList, setempList] = useState([])
    const [sumList, setsumList] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [updateEmployeeInfo, setUpdateEmployeeInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const [rowsUpdated, setRowsUpdated] = useState();
    useEffect(() => {
        getEmployees();
        getsumValues();
    }, [])

    function getEmployees() {
        fetch('api/Employees')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setempList(data);
            })
            .catch(error => {
                console.log(error);// Check if error in console
                alert(error);
            })
    }

    function getsumValues() {
        fetch('api/List/')
            .then(response => response.json())
            .then(data => {
                setsumList(data);
            })
            .catch(err => {
                console.log(err) // Check if error in console
                alert(err);
            })
    }

    const deleteEmployee = (id) => {
        setShowAddForm(false);
        setUpdateEmployeeInfo(null);
        if (window.confirm('Are you sure to delete the Employee?')) {
            fetch('api/Employees/' + id, {
                method: 'DELETE',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(res => {
                    alert(res);
                    const newEmpList = empList.filter((emp) => emp.id != id);
                    setempList(newEmpList);
                    getsumValues();
                })
                .catch((error) => {
                    console.log(error);
                    alert(error);
                });

        }
    }

    function onEmployeeAdded(employeeAdded) {
        setShowAddForm(false);
        if (employeeAdded === null) {
            return;
        }
        setTimeout(() => {
            getEmployees();
            getsumValues();
        }, 1000);
    }

    function onEmployeeUpdated(employeeUpdated) {
        setUpdateEmployeeInfo(null);
        if (employeeUpdated === null) {
            return;
        }
        let empListCopy = [...empList];
        const index = empListCopy.findIndex((empCopy, currentIndex) => {
            if (empCopy.id === employeeUpdated.id) {
                return true;
            }
        });

        if (index !== -1) {
            empListCopy[index] = employeeUpdated;
        }
        setempList(empListCopy);
        setTimeout(() => {
            getsumValues();
        }, 1000);
    }

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = empList.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(empList.length / recordsPerPage);


    return (
        <div className="divMain"><h1>Interview Test Results</h1>
            <div className="divCreatebtn"><button onClick={() => { setShowAddForm(true); setUpdateEmployeeInfo(null); }}>
                Create New Employee</button></div>
            <div className="divChild">
                <h4>Employee Dashboard</h4>
                <table className="table" >
                    <thead>
                        <tr>
                            <th scope='col'>ID</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Value</th>
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map(emp =>
                            <tr key={emp.id}>
                                <td>{emp.id}</td>
                                <td>{emp.name}</td>
                                <td>{emp.value}</td>
                                <td>
                                    <a CssClass="action" onClick={() => { setUpdateEmployeeInfo(null); setUpdateEmployeeInfo(emp); setShowAddForm(false); }}>Edit</a>
                                    <a CssClass="action" onClick={() => deleteEmployee(emp.id)}>Delete</a>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Pagination
                    nPages={nPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />

            </div>
            {showAddForm && <AddEmployeeForm onEmployeeAdded={onEmployeeAdded} setRowsUpdated={setRowsUpdated}></AddEmployeeForm>}
            {updateEmployeeInfo !== null && <UpdateEmployeeForm empInfo={updateEmployeeInfo}
                onEmployeeUpdated={onEmployeeUpdated} setRowsUpdated={setRowsUpdated}></UpdateEmployeeForm>}
            <div className="divChild">
                <div className="divSum">
                    <h4>Sum of Values Information</h4>
                    <table className="tbEmpForm"><thead></thead>
                        <tbody>
                            {sumList.map(sumData =>
                                <tr key={sumData.sumText}>
                                    <td>{sumData.sumText}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="divRed">{rowsUpdated}</div>
                </div>
            </div>
        </div>
    );

}
export default Employee;


