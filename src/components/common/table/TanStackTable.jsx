import React, { useState } from 'react'
import './table-style.scss'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { HiArrowsUpDown, HiMiniArrowDown, HiMiniArrowUp } from "react-icons/hi2";
import { TbColumns3 } from "react-icons/tb";
import Modal from '../modal/Modal';
import ColumnsList from './ColumnsList';



function TanStackTable({ columns, data, rowCheckBox = false, topRight, bulkActions, columnVisible }) {
    // Table latest version : 04 Oct 2024

    // Example
    //  const columns = [
    //     { header: 'Name', accessorKey: 'name', enableHiding: false, },
    //     { header: 'Email', accessorKey: 'email', meta: { className: 'col-id', style: { fontWeight: 'bold', color: 'red' } } },
    //     { header: 'Role', accessorKey: 'role', cellStyle: { color: 'blue', fontWeight: 'bold' } },
    //     {
    //         header: 'Actions',
    //         cell: ({ row }) => (
    //             <div className="action-buttons">
    //                 <button onClick={(e) => handleEdit(e, row.original)}>Edit</button>
    //                 <button onClick={(e) => handleDelete(e, row.original)}>Delete</button>
    //             </div>
    //         ),
    //         enableSorting: false,
    //         enableColumnFilter: false,
    //     },
    // ];

    //   const list = Array.from({ length: 20 }, (_, i) => ({
    //     name: `User ${i + 1}`,
    //     _rowStyle: { backgroundColor: '#e0f7fa', cursor: 'Pointer' },
    //     _rowClassName: 'row-user',
    //     _cellStyle: {
    //         name: { fontWeight: 'bold', backgroundColor: '#e0f7fa' }
    //     },
    //      _onClick: () => navigate(`/user/1`)
    // }));

    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState(columnVisible);
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState([]);
    const [modal, setModal] = useState({ status: false })


    const table = useReactTable({
        data,
        columns: [
            ...(rowCheckBox ? [

                {
                    id: 'select',
                    header: ({ table }) => (
                        <label className="table-checkbox-input">
                            <input type="checkbox"
                                checked={table.getIsAllRowsSelected()}
                                onChange={table.getToggleAllRowsSelectedHandler()}
                            />
                            <span className="checkbox-box"></span>
                        </label>
                    ),
                    cell: ({ row }) => (
                        <label className="table-checkbox-input">
                            <input type="checkbox"
                                checked={row.getIsSelected()}
                                onChange={row.getToggleSelectedHandler()}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <span className="checkbox-box"></span>
                        </label>
                    ),
                    enableSorting: false,
                    enableHiding: false
                }
            ] : []),
            ...columns
        ],
        state: {
            globalFilter,
            columnVisibility,
            rowSelection,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const totalRows = table.getFilteredRowModel().rows.length;
    const startRow = pageIndex * pageSize + 1;
    const endRow = Math.min(startRow + pageSize - 1, totalRows);

    const handleColumnHide = () => {
        console.log(columnVisibility)
        setModal({
            status: true,
            title: "Edit Columns",
            content: <ColumnsList table={table} columnVisibility={columnVisibility} />
        })
    }

    return (
        <div className="tanstack-table-div">
            {/* Modal */}
            <Modal modal={modal} setModal={setModal} />
            {/* Top Section */}
            <div className="table-filter-top">
                <div className="table-filter-left">
                    {/* Search */}
                    <div className="text-input-div">
                        <NormalInput id={'search'} name='search' value={globalFilter} isRequired={false}
                            onChangeFun={(e) => setGlobalFilter(e.target.value)} label='Search...' />
                    </div>
                </div>
                <div className="table-filter-right">
                    {topRight}
                    <SingleButton style={{ marginLeft: '10px' }} stIcon={<TbColumns3 />} classNames={'icon-only'} onClick={handleColumnHide} />
                </div>
            </div>

            {/* Bulk Action */}
            {Object.keys(rowSelection).length > 0 && (
                <div className="bulk-actions">
                    <div className="section-one">
                        <span>{Object.keys(rowSelection).length} Selected</span>
                    </div>
                    <div className="section-two">{bulkActions}</div>
                </div>
            )}

            {/* Table section */}
            <div className="table-filter-content">
                <table className={`custom-table ${rowCheckBox && 'RowCheckBox'}`}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === 'asc' ? <HiMiniArrowUp className='sort-icon ascent-sort' />
                                            : header.column.getIsSorted() === 'desc' ? <HiMiniArrowDown className='sort-icon descent-sort' />
                                                : header.column.columnDef.enableSorting !== false ? <HiArrowsUpDown className='sort-icon' /> : ""}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>

                        {table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                style={row.original._rowStyle || {}}
                                className={`table-row ${row.original._rowClassName || ''}`}
                                onClick={(e) => row.original._onClick?.(e)}
                            >
                                {row.getVisibleCells().map(cell => {
                                    const colMeta = cell.column.columnDef.meta || {};
                                    const cellStyle = row.original._cellStyle?.[cell.column.id] || {};

                                    return <td className={`${colMeta.className || ''} ${row?.getIsSelected() && 'selected-td'}`} key={cell.id}
                                        onClick={(e) => cell.column.id === 'select' && e.stopPropagation()}
                                        style={{ ...colMeta.style, ...cellStyle }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom content */}
            <div className="table-filter-bottom">
                <div className="table-filter-left">
                    <div className="page-row">
                        <label htmlFor="">Rows per page:</label>
                        <select onChange={e => table.setPageSize(Number(e.target.value))}
                            value={table.getState().pagination.pageSize}>
                            {[10, 25, 50, 100].map(size => (<option key={size} value={size}>{size}</option>))}
                        </select>
                    </div>
                </div>

                <div className="table-filter-right">
                    <div className="page-numbers">
                        <p>{table.getFilteredRowModel().rows.length ? startRow : 0}-{endRow} of {table.getFilteredRowModel().rows.length}</p>
                    </div>
                    <div className="pagination-buttons">
                        <SingleButton type={'button'} stIcon={<IoIosArrowBack />} classNames={'btn-primary'}
                            onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />
                        <SingleButton type={'button'} stIcon={<IoIosArrowForward />} classNames={'btn-primary'}
                            onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default TanStackTable