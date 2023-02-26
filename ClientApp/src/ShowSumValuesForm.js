import React, { useState, useEffect } from 'react';


export default function ShowSumValuesForm() {

    // To hold the actual data
    const [sumList, setsumList] = useState([]);
    useEffect(() => {
        getsumValues();
    }, [])

    function getsumValues() {
        fetch('api/List/')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setsumList(data);
            })
            .catch(err => {
                console.log(err) // Check if error in console
                //sumList('API Failed');
            })
    }

    return (
        <div className="divChild">
            <div>
                <table><thead></thead>
                    <tbody>
                        {sumList.map(sumData =>
                            <tr key={sumData.sumText}>
                                <td>{sumData.sumText}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

}
