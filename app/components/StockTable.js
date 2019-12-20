import React, {useState} from "react";
import {
    Grid,
    Table as ReactTable,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    TableSortLabel,
} from '@material-ui/core';
import baseData from "./baseData"
import { remote } from "electron";

const { Menu, MenuItem } = remote;
const baseRows = baseData['baseRows'];
const tableRows = baseData['tableRows'];

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function EnhancedTableHead(props) {
    const { order, orderBy, rows, onRequestSort} = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {baseRows.map(row => {
                    if (row.name === "categoryId") return null;
                    return (
                        <TableCell
                            key={row.name}
                            sortDirection={orderBy === row.name ? order : false}
                        >
                            <Tooltip
                                title="Sort"
                                enterDelay={300}
                            >
                                <TableSortLabel
                                    active={orderBy === row.name}
                                    direction={order}
                                    onClick={createSortHandler(row.name)}
                                >
                                    {row.label}
                                </TableSortLabel>
                            </Tooltip>
                        </TableCell>
                    )
                })}
                {tableRows.map(row => (
                    <TableCell
                        key={row.name}
                        sortDirection={orderBy === row.name ? order : false}
                    >
                        <Tooltip
                            title="Sort"
                            enterDelay={300}
                        >
                            <TableSortLabel
                                active={orderBy === row.name}
                                direction={order}
                                onClick={createSortHandler(row.name)}
                            >
                                {row.label}
                            </TableSortLabel>
                        </Tooltip>
                    </TableCell>
                ))}
                {rows.map(row => (
                    <TableCell
                        key={row.id}
                        sortDirection={orderBy === row.name ? order : false}
                    >
                        <Tooltip
                            title="Sort"
                            enterDelay={300}
                        >
                            <TableSortLabel
                                active={orderBy === row.name}
                                direction={order}
                                onClick={createSortHandler(row.name)}
                            >
                                {row.label}
                            </TableSortLabel>
                        </Tooltip>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function StockTable(props) {
    let {rows, products, toggleUpdateProductDialog} = props;
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const productMenu = new Menu();
    productMenu.append(new MenuItem({ label: 'Modifier le produit', click: () => toggleUpdateProductDialog(true, productMenu.product)}));

    const handleRightClickProduct = (event, product) => {
        event.preventDefault();
        productMenu.product = product;
        productMenu.popup({window: remote.getCurrentWindow()});
    };

    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    rows = rows.filter(function(obj) {
        return obj.displayTable === true;
    });

    return (
        <Grid item xs={12}>
            <ReactTable>
                <EnhancedTableHead
                    rows={rows}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={products.length}
                />
                <TableBody className={"tbody-products"}>
                    {stableSort(products, getSorting(order, orderBy)).map(product => {
                        return (
                            <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={product.id}
                                onContextMenu={(event) => handleRightClickProduct(event, product)}
                            >
                                {baseRows.map(row => {
                                    if (row.name === "categoryId") return null;
                                    return (
                                        <Cell key={row.name} align="right" row={row.name} value={product[row.dbName]}/>
                                    )
                                })}
                                {tableRows.map(row => (
                                    <Cell key={row.name} align="right" row={row.name} value={product[row.dbName]}/>
                                ))}
                                {rows.map(n => (
                                    <TableCell key={n.id} align="right">{product.productData[n.name]}</TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </ReactTable>
        </Grid>
    );
}

function Cell(props) {
    const {value, row} = props;
    let cellContent;
    if (row === 'providers' || row === 'makers') {
        cellContent = Array.from(new Set(value.map(function (item) { // turn array of object into set of strings to prevent duplicate then join
            return item['name'];
        }))).join(', ')
    } else if (row === 'quantity') {
        cellContent = value.reduce( function(a, b){ // get the sum of the stock from every providers
            return a + b['quantity'];
        }, 0);
    } else if (row === 'price') {
        cellContent = parseFloat(value.reduce( function(a, b){ // get the sum of prices from every stock
            return a + b['pricePerUnit'] * b['quantity'];
        }, 0).toFixed(2)) + '€';
    } else {
        cellContent = value;
    }

    return (
        <TableCell >
            {cellContent}
        </TableCell>
    )
}
