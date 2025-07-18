import React, { useState } from 'react'
import CheckboxInput from '../inputs/CheckboxInput';

const ColumnsList = ({ table, columnVisibility, columnListing }) => {

    const [columnVisibleData, setColumnVisibleData] = useState(columnVisibility || {})

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: "5px" }}>
            {table.getAllLeafColumns()
                .filter((column) => columnListing?.[column.id] !== false)
                .map((column) => (
                    <CheckboxInput checked={columnVisibleData?.[column.id] !== false} label={column.id}
                        disable={column.columnDef.enableHiding === false}
                        onChangeFun={() => {
                            if (column.columnDef.enableHiding !== false) {
                                column.toggleVisibility(!column.getIsVisible());
                                setColumnVisibleData({
                                    ...columnVisibleData,
                                    [column.id]: !column.getIsVisible()
                                })
                            }
                        }} />
                ))}
        </div>
    )
}

export default ColumnsList