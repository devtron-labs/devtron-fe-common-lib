import React, { useEffect, useState } from 'react'
import { fetchChartTemplateVersions } from './Common.service'
import { ChartVersionAndTypeSelectorProps, DeploymentChartVersionType } from './Types'
import ReactSelect from 'react-select'
import { customStyles, getFilteredChartVersions, showError } from './Helper'

// @TODO: Generalize this component to be used in CodeEditor as Chart selector toolbar
// when the Code Editor is moved to the fe-common-lib
const ChartVersionAndTypeSelector = ({ setSelectedChartRefId }: ChartVersionAndTypeSelectorProps) => {
    const [charts, setCharts] = useState<DeploymentChartVersionType[]>([])
    const [selectedChartType, setSelectedChartType] = useState(null)
    const [chartVersionOptions, setChartVersionOptions] = useState([])
    const [chartTypeOptions, setChartTypeOptions] = useState([])
    const [selectedChartVersion, setSelectedChartVersion] = useState(null)

    useEffect(() => {
        fetchChartTemplateVersions()
            .then((res) => {
                const charts = res?.result
                setCharts(charts)
                // Extract unique chart types from the data
                const chartTypeOptions = [...new Set(charts.map((item) => item.chartType))].map((type) => ({
                    value: type,
                    label: type,
                }))
                setChartTypeOptions(chartTypeOptions)
                const filteredVersions = getFilteredChartVersions(charts, chartTypeOptions[0])
                selectFirstChartVersion(filteredVersions)
            })
            .catch((err) => {
                showError(err)
            })
    }, [])

    const selectFirstChartVersion = (filteredVersions) => {
        setChartVersionOptions(filteredVersions)
        setSelectedChartVersion(filteredVersions[0]) // Select the first chart version by default
        setSelectedChartRefId(filteredVersions[0]?.chartRefId)
    }

    // Function to update chart version options based on selected chart type
    const handleChartTypeChange = (selectedOption) => {
        setSelectedChartType(selectedOption)
        const filteredVersions = getFilteredChartVersions(charts, selectedOption)
        selectFirstChartVersion(filteredVersions)
    }

    // Function to handle the change of the selected chart version
    const handleChartVersionChange = (selectedOption) => {
        setSelectedChartVersion(selectedOption)
        setSelectedChartRefId(selectedOption?.chartRefId)
    }

    return (
        <div className="flex">
            <div className="chart-type-options flex" data-testid="chart-type-options">
                <span className="chart-type-options-label mr-4">Chart Type</span>
                <ReactSelect
                    value={selectedChartType ?? chartTypeOptions[0]}
                    options={chartTypeOptions}
                    onChange={handleChartTypeChange}
                    styles={customStyles}
                />
            </div>
            <div className="chart-version-options flex" data-testid="chart-version-options">
                <span className="chart-version-options-label mr-4">Chart Version</span>
                <ReactSelect
                    value={selectedChartVersion ?? chartVersionOptions[0]}
                    options={chartVersionOptions}
                    onChange={handleChartVersionChange}
                    styles={customStyles}
                />
            </div>
        </div>
    )
}

export default ChartVersionAndTypeSelector
