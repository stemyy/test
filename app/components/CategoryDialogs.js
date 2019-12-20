import React, {useState, useEffect} from 'react';
import ModifyCategory from './Dialog/ModifyCategory';
import AddCategory from './Dialog/AddCategory';
import {
    Dialog,
    DialogTitle,
} from "@material-ui/core";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as CategoryAction from "../actions/category";
import * as ProductActions from "../actions/product";


const CategoryDialogs = (props) => {
    const {type, category, productActions, categoryActions, toggleDialogCategory, products} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(null);

    useEffect(() => {
        if (type === 'add_category') {
            setContent(<AddCategory toggleDialogCategory={toggleDialogCategory} addCategory={categoryActions.addCategory}/>);
            setTitle('Ajouter une catégorie');
            setIsOpen(true);
        } else if (type === 'update_category' && category && category.id !== 0) {
            setContent(<ModifyCategory category={category} updateCategory={categoryActions.updateCategory} removeCategory={categoryActions.removeCategory} updateProductsCategories={productActions.updateProductsCategories} toggleDialogCategory={toggleDialogCategory} products={products}/>);
            setTitle("Modifier la catégorie "+category.name);
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [type]);

    return (
        <Dialog open={isOpen} onClose={() => toggleDialogCategory(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            {content}
        </Dialog>
    )
};


function mapDispatchToProps(dispatch) {
    return {
        categoryActions: bindActionCreators(CategoryAction, dispatch),
        productActions: bindActionCreators(ProductActions, dispatch)
    }
}

export default connect(null,
    mapDispatchToProps
)(CategoryDialogs);
