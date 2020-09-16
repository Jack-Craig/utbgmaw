import React from 'react';
import _ from 'lodash'
import Chart from 'chart.js'
import './PlanMaker.css'

class PlanMaker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            days: [],
            weight: [],
            chart: null
        }
        this.chartRef = React.createRef()
    }

    calculateOneRepMax = (reps, weight) => {
        return weight * (1 + reps / 30)
    }

    generateRepPlan = (startBench, startSquat, startOHP, days) => {
        const repRange = [4, 6]
        const increaseDuration = 14
        const increaseWeight = 10

        const dayRepIncrease = Math.floor(increaseDuration / (repRange[1] - repRange[0] + 1)) // Number of days before increasing reps
        console.log(startSquat, startBench)
        let day = [{
            bench: {
                max: Math.floor(this.calculateOneRepMax(repRange[0], startBench)),
                reps: repRange[0],
                weight: startBench
            },
            squat: {
                max: Math.floor(this.calculateOneRepMax(repRange[0], startSquat)),
                reps: repRange[0],
                weight: startSquat
            },
            ohp: {
                max: Math.floor(this.calculateOneRepMax(repRange[0], startOHP)),
                reps: repRange[0],
                weight: startOHP
            }
        }]
        for (let i = 1; i < days; i++) {
            let yesterday = day[i - 1]
            let today = { ...yesterday }
            for (const key of Object.keys(today)) {
                let todayLift = { ...today[key] }
                if (i % dayRepIncrease == 0) {
                    todayLift.reps += _.inRange(today[key].reps + 1, repRange[0], repRange[1] + 1) ? 1 : 0
                }
                if (i % increaseDuration == 0) {
                    todayLift.weight += i < 45 ? increaseWeight : increaseWeight / 2
                    todayLift.reps = repRange[0]
                }
                todayLift.max = Math.floor(this.calculateOneRepMax(todayLift.reps, todayLift.weight))
                today[key] = todayLift
            }
            day.push(today)
        }
        return day
    }

    generateWeightPlan = (startingWeight, calorieSurplus, maxSurplus, numDays) => {
        const surplusPerDay = _.floor((maxSurplus - calorieSurplus) / numDays)
        let weight = [{
            weight: startingWeight,
            surplus: calorieSurplus
        }]
        for (let i = 1; i < numDays; i++) {
            let weightObj = {
                surplus: weight[i - 1].surplus + surplusPerDay
            }
            const weightPerWeek = weightObj.surplus / 500
            const weightPerDay = weightPerWeek / 7
            weight.push({
                ...weightObj,
                weight: weight[i - 1].weight + weightPerDay,
            })
        }
        return weight
    }

    componentDidMount = () => {
        const chartRef = this.chartRef.current.getContext("2d");
        const days = this.generateRepPlan(155, 155, 85, 72)
        const chart = new Chart(chartRef, {
            type: "line",
            data: {
                labels: _.reduce(days, (acum, val, index) => {
                    acum.push(index + 1)
                    return acum
                }, []),
                datasets: [
                    {
                        label: "Equivalent Bench Max",
                        data: _.reduce(days, (prev, val, index) => {
                            prev.push(val.bench.max)
                            return prev
                        }, []),
                        fill: false,
                        borderColor: 'red'
                    },
                    {
                        label: "Working Bench Weight",
                        data: _.reduce(days, (prev, val, index) => {
                            prev.push(val.bench.weight)
                            return prev
                        }, []),
                        fill: false,
                        borderColor: 'orange'
                    },
                    {
                        label: "Working Squat Weight",
                        data: _.reduce(days, (prev, val, index) => {
                            prev.push(val.squat.max)
                            return prev
                        }, []),
                        fill: false,
                        borderColor: 'blue'
                    },
                    {
                        label: "Working Squat Weight",
                        data: _.reduce(days, (prev, val, index) => {
                            prev.push(val.squat.weight)
                            return prev
                        }, []),
                        fill: false,
                        borderColor: 'aqua'
                    },
                    {
                        label: "Working OHP Weight",
                        data: _.reduce(days, (prev, val, index) => {
                            prev.push(val.ohp.max)
                            return prev
                        }, []),
                        fill: false,
                        borderColor: 'purple'
                    },
                    {
                        label: "Working OHP Weight",
                        data: _.reduce(days, (prev, val, index) => {
                            prev.push(val.ohp.weight)
                            return prev
                        }, []),
                        fill: false,
                        borderColor: 'pink'
                    }
                ]
            },
            options: {
                //Customize chart options
            }
        });
        this.setState({
            days: days,
            weight: this.generateWeightPlan(152, 600, 1000, 72),
            chart: chart
        })
    }

    render() {
        return (
            <main>
                <div className="data-table-container">
                    {this.state.days.length && Object.keys(this.state.days[0]).map((key, keyIndex) => {
                        return (
                            <div className="data-table">
                                <h2>{key}</h2>
                                <table>
                                    <tr>
                                        {keyIndex == 0 &&
                                            <th>
                                                Day
                                        </th>
                                        }
                                        <th>
                                            Weight
                                        </th>
                                        <th>
                                            Reps
                                        </th>
                                        <th>
                                            Max
                                        </th>
                                    </tr>
                                    {this.state.days.map((val, index) => {
                                        return (
                                            <tr>
                                                {
                                                    keyIndex == 0 &&
                                                    <td>
                                                        {index}
                                                    </td>
                                                }

                                                <td>
                                                    {index === 0 && val[key].weight}
                                                    {(index > 0 && this.state.days[index - 1][key].weight !== val[key].weight) && val[key].weight}
                                                    {(index > 0 && this.state.days[index - 1][key].weight === val[key].weight) && "..."}
                                                </td>
                                                <td>
                                                    {index === 0 && val[key].reps}
                                                    {(index > 0 && this.state.days[index - 1][key].reps !== val[key].reps) && val[key].reps}
                                                    {(index > 0 && this.state.days[index - 1][key].reps === val[key].reps) && "..."}
                                                </td>
                                                <td>
                                                    {index === 0 && val[key].max}
                                                    {(index > 0 && this.state.days[index - 1][key].max !== val[key].max) && val[key].max}
                                                    {(index > 0 && this.state.days[index - 1][key].max === val[key].max) && "..."}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </table>
                            </div>
                        )
                    })}
                    <div className="data-table">
                        <h2>weight</h2>
                        <table>
                            <tr>
                                <th>
                                    Weight
                                        </th>
                                        <th>
                                            Calorie Surplus
                                        </th>
                            </tr>
                            {this.state.weight.map((val, index) => {
                                let weightStr = String(val.weight)
                                const dotIndex = weightStr.indexOf('.')
                                weightStr = weightStr.substring(0, dotIndex > -1 ? dotIndex + 3 : weightStr.length)
                                return (
                                    <tr>
                                        <td>
                                            {weightStr}
                                        </td>
                                        <td>
                                            {val.surplus}
                                        </td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                </div>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </main>
        )
    }
}

export default PlanMaker;