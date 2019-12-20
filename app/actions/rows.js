const _addRow = (row) => ({
    type: 'ADD_PRODUCT',
    row
});

export const addRow = (RowData = {
    title: '',
    description: '',
    author: '',
    published: 0
}) => {
    return (dispatch) => {
        const row = {
            title: RowData.title,
            description: RowData.description,
            author: RowData.author,
            published: RowData.published
        };
        //return axios.post('products/create', product).then(result => {
        dispatch(_addRow(row));
        //});
    };
};

const _removeRow = ({ id } = {}) => ({
    type: 'REMOVE_ROW',
    id
});

export const removeRow = ({ id } = {}) => {
    return (dispatch) => {
        //return axios.delete(`products/${id}`).then(() => {
        dispatch(_removeRow({ id }));
        //})
    }
};

const _getRows = (rows) => ({
    type: 'GET_ROWS',
    rows
});

export const getRows = () => {
    return (dispatch) => {

        //return axios.get('products').then(result => {
        const rows = [];

        result.data.forEach(item => {
            rows.push(item);
        });

        dispatch(_getRows(rows));
        //});
    };
};
