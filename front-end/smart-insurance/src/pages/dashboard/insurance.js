import { useMemo } from 'react'
import {useTable} from 'react-table'
import {ProductList} from '../../ProductList'
import testdata from './testdata.json'

export default function Insurance(props){
    return(
        <div id="dashboard_insurance">
            <Products />
            <CurrentlyOwned />
        </div>
    )
}

function Products(props){
    const list = ProductList.map((item)=>{
        return <div key={item.id}>{item.name}</div>
    })
    return(
        <div id="dashboard_products">
            <p>Product List</p>
            <div id="dashboard_productList">
                {list}
            </div>
        </div>
    )
}

function CurrentlyOwned(props){
    const data = useMemo(()=>testdata, [])
    const columns = useMemo(()=> getHeaders(data[0]), [data])

    const tableInstance = useTable({columns, data})
    const {
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        rows, 
        prepareRow} = tableInstance
    return(
        <div id="dashboard_currentlyOwned">
            <p>Currently Owned</p>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup)=>(
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column)=>(
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row)=>{
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell)=>{
                                    return(<td {...cell.getCellProps()}>{cell.render('Cell')}</td>)
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}


function getHeaders(row){
    //formats header names from the key and returns format for react-table
    let columns = []
    let keys = Object.keys(row)
    for(let key of keys){
        columns.push({
            Header: key[0].toUpperCase() + key.replace(/([A-Z])/g, ' $1').trim().slice(1),
            accessor: key
        })
    }
    return columns
}