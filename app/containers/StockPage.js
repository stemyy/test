import { bindActionCreators } from 'redux';
import { useSelector, connect } from 'react-redux';
import React, {useState, useEffect} from 'react';
import * as ProductActions from '../actions/product';
import StockTable from "../components/StockTable";
import StockDialogs from "../components/StockDialogs";
import CategoryDialog from "../components/CategoryDialogs";
import UpdateProductDialog from "../components/UpdateProductDialog";
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { remote } from 'electron';
const { Menu, MenuItem } = remote;

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ProductActions, dispatch);
}

function StockPage(props) {
    const products = useSelector(state => state.products);
    const rows = useSelector(state => state.rows);
    const categories = useSelector(state => state.categories);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [categoryType, setCategoryType] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(0);
    const [editProductDialogIsOpen, setEditProductDialogIsOpen] = useState(false);
    const categoryMenu = new Menu();
    const {removeProduct, addProduct, updateProduct, refreshProducts} = props;

    useEffect(() => {
        if (activeTab !== 0) {
            const exists = categories.find(category => category.id === activeTab);
            if (!exists) setActiveTab(0);
        }
    }, [categories]);

    useEffect(() => {
        refreshProducts();
    }, []);

    const toggleDialogCategory = (type, category) => {
        if (type === 'update_category' && !category) return null;
        setSelectedCategory(category);
        setCategoryType(type);
    };

    const toggleUpdateProductDialog = (isOpen, product) => {
        if (isOpen) setSelectedProduct(product);
        setEditProductDialogIsOpen(isOpen);
    };

    const handleRightClickCategory = (event, category = null) => {
        event.preventDefault();
        categoryMenu.category = category;
        categoryMenu.popup({window: remote.getCurrentWindow()});
    };

    const handleChangeTab = (event, value) => {
        setActiveTab(value);
    };

    categoryMenu.append(new MenuItem({ label: 'Modifier la catégorie', click: () => toggleDialogCategory('update_category', categoryMenu.category)}));
    categoryMenu.append(new MenuItem({ type: 'separator'}));
    categoryMenu.append(new MenuItem({ label: 'Ajouter une catégorie', click: () => toggleDialogCategory('add_category', categoryMenu.category)}));

    return (
        <React.Fragment>
            <AppBar position="static" color="primary">
                <Tabs value={activeTab} onChange={handleChangeTab} centered>
                    <Tab value={0} label="Tous" onContextMenu={(event) => handleRightClickCategory(event)}/>
                    {categories.map(category => (
                        <Tab
                            onContextMenu={(event) => handleRightClickCategory(event, category)}
                            value={category.id}
                            key={category.id}
                            label={category.name}
                        />
                    ))}
                </Tabs>
            </AppBar>
            <StockDialogs rows={rows} addProduct={addProduct}/>
            <StockTable rows={rows} products={(activeTab !== 0) ? products.filter(product => product.categoryId === activeTab) : products} toggleUpdateProductDialog={toggleUpdateProductDialog}/>
            <UpdateProductDialog product={selectedProduct} isOpen={editProductDialogIsOpen} setIsOpen={toggleUpdateProductDialog} removeProduct={removeProduct} updateProduct={updateProduct}/>
            <CategoryDialog toggleDialogCategory={toggleDialogCategory} products={products} category={selectedCategory} type={categoryType}/>
        </React.Fragment>
    );
}

export default connect(null,
    mapDispatchToProps
)(StockPage);
