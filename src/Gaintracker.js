import React from 'react';
import './Gaintracker.css'

class GainTracker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            weightData: [
                {
                    name: 'Jack Craig',
                    bench: 155,
                    squat: 185,
                    deadlift: 225,
                },
            ],
            
        }
    }

    render() {
        return (
            <div>
                <h1> Welcome To The Gain Tracker </h1>
                <table className="weight-grid">
                    <tr className="weight-grid-row">
                        <th>Name</th>
                        <th>Bench Max</th>
                        <th>Squat Max</th>
                        <th>Deadlift Max</th>
                    </tr>
                    {
                        this.state.weightData.map((value, index) => {
                            return (
                                <tr className="weight-grid-row">
                                    <td>{value.name}</td>
                                    <td>{value.bench}</td>
                                    <td>{value.squat}</td>
                                    <td>{value.deadlift}</td>
                                </tr>
                            )
                        })
                    }
                     <tr className="weight-grid-row">
                        <th><input type='text'></input></th>
                        <th><input type='text'></input></th>
                        <th><input type='text'></input></th>
                        <th><input type='text'></input></th>
                    </tr>
                </table>
            </div>
        )
    }
}

export default GainTracker;