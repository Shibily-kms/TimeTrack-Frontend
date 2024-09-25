import React, { useEffect, useState } from 'react'
import './table-filter.scss'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'


function TableFilter({ children, srlNo, topRight }) {

    const headContent = children.props.children[0].props.children
    const bodyContent = children.props.children[1].props.children
    const [childrenBody, setChildrenBody] = useState([])
    const [tableBody, setTableBody] = useState([])
    const [rowCount, setRowCount] = useState(10)
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')

    const handlePageRows = (e) => {
        setRowCount(Number(e.target.value))
        setPage(1)
    }

    const handlePagination = (value) => {
        setPage(page + value)
    }

    const handleSearch = (e) => {
        setSearchText(e.target.value)
        const regex = new RegExp(e.target.value, 'i');
        const filteredData = bodyContent.filter((item) => {
            const check = item.props.children.filter((td) => regex.test(td.props.children))
            if (check[0]) {
                return check
            }
            return false
        })

        setChildrenBody(filteredData)
        setPage(1)
    }

    useEffect(() => {
        setTableBody(childrenBody?.slice(rowCount * (page - 1), rowCount * page))
    }, [rowCount, page, childrenBody])


    useEffect(() => {
        setChildrenBody(children?.props?.children?.[1]?.props?.children)
        setTableBody(children?.props?.children?.[1]?.props?.children?.slice(rowCount * (page - 1), rowCount * page))
        // eslint-disable-next-line 
    }, [children?.props?.children?.[1]?.props?.children?.length])

    return (
        <div className="table-filter">
            <div className="table-filter-top">
                <div className="table-filter-left">
                    {/* Search */}
                    <div className="text-input-div">
                        <NormalInput id={'search'} name='search' value={searchText} isRequired={false} onChangeFun={handleSearch} label='Search' />
                    </div>
                </div>
                <div className="table-filter-right">
                    {topRight}
                </div>
            </div>
            <div className="table-filter-content">
                <table>
                    <thead>
                        <tr>
                            {srlNo ? <th>Idx No</th> : ""}
                            {headContent?.props?.children?.map((head) => {
                                return head;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody?.map((row, index) => (
                            <tr key={index} className={row?.props?.className}>
                                {srlNo ? <td>{(rowCount * (page - 1)) + index + 1}</td> : ""}
                                {row?.props?.children?.map((col) => {
                                    return col;
                                })}
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            <div className="table-filter-bottom">
                <div className="table-filter-left">
                    <div className="page-row">
                        <label htmlFor="">Rows per page:</label>
                        <select onChange={handlePageRows}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
                <div className="table-filter-right">
                    <div className="page-numbers">
                        <p>{(page - 1) * rowCount + 1}-{Math.min(rowCount * page, childrenBody?.length)} of {childrenBody?.length}</p>
                    </div>
                    <div className="pagination-buttons">
                        <SingleButton stIcon={<IoIosArrowBack />} classNames={(page - 1) * rowCount + 1 !== 1 ? 'btn-primary' : 'btn-gray'}
                            onClick={() => (page - 1) * rowCount + 1 !== 1 ? handlePagination(-1) : ''} />
                        <SingleButton stIcon={<IoIosArrowForward />} classNames={Math.min(rowCount * page, childrenBody?.length) !== childrenBody?.length ? 'btn-primary' : 'btn-gray'}
                            onClick={() => Math.min(rowCount * page, childrenBody?.length) !== childrenBody?.length ? handlePagination(1) : ''} />

                    </div>
                </div>
            </div>


        </div >
    )
}

export default TableFilter