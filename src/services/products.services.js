import { getRequest, postRequest, putRequest, deleteRequest } from './verb.services'
import { setAllProducts } from '../actions/products.action';
import { openNotificationWithIcon } from '../utils/notification';
import moment from 'moment'


export const getAllProducts = (id) => {
  return (dispatch) => {
    return getRequest(`product?client=${id}`, null, true, dispatch)
      .then(({ data }) => {
        let newSource = [...data.data]
        newSource = newSource.sort(function (a, b) {
          const aa = a.name.toLowerCase();
          const bb = b.name.toLowerCase();
          if (aa < bb) { return -1; }
          if (aa > bb) { return 1; }
          return 0;
        })
        let allProducts = newSource
        allProducts = allProducts.map(product => {
          product.categoryName = product.category.name;
          product.key = product._id;
          //
          if (product.latestOffer.date) { // TODO: Explain this.
            product.lastOffered = moment(product.latestOffer.date).format('MMM DD,YYYY')
          } else {
            product.lastOffered = product.latestOffer.title
          }
          return product;
        })
        dispatch(setAllProducts(allProducts))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const getProductsByDate = (minDate, maxDate) => {
  return (dispatch) => {
    return getRequest('product', { minDate, maxDate }, true, dispatch)
      .then(({ data }) => {
        let newSource = [...data.data]
        newSource = newSource.sort(function (a, b) {
          const aa = a.name.toLowerCase();
          const bb = b.name.toLowerCase();
          if (aa < bb) { return -1; }
          if (aa > bb) { return 1; }
          return 0;
        })
        let allProducts = newSource
        allProducts = allProducts.map(product => {
          product.categoryName = product.category.name;
          product.key = product._id;
          //
          if (product.latestOffer.date) {
            product.lastOffered = moment(product.latestOffer.date).format('MMM DD,YYYY')
          } else {
            product.lastOffered = product.latestOffer.title
          }
          return product;
        })
        dispatch(setAllProducts(allProducts))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const addProduct = (data, prevSource) => {
  return (dispatch) => {
    return postRequest('product', null, true, data, dispatch)
      .then(({ data }) => {
        let newProducts = [...prevSource];
        const newProduct = { ...data.data }
        newProduct.categoryName = data.data.category.name
        if (newProduct.latestOffer.date) {
          newProduct.lastOffered = moment(newProduct.latestOffer.date).format('MMM DD,YYYY')
        } else {
          newProduct.lastOffered = newProduct.latestOffer.title
        }
        newProducts.splice(0, 0, newProduct)
        dispatch(setAllProducts(newProducts))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const editProduct = (pid, data, prevSource) => {
  return (dispatch) => {
    return putRequest(`product/${pid}`, null, true, data, dispatch)
      .then(({ data }) => {
        let newProducts = [...prevSource]
        newProducts = newProducts.map((product, id) => {
          if (product._id === pid) {
            const updatedProduct = { ...data.data }
            updatedProduct.key = updatedProduct._id;
            updatedProduct.categoryName = updatedProduct.category.name;
            return newProducts[id] = updatedProduct
          }
          return product
        })
        dispatch(setAllProducts(newProducts))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const deleteProduct = (id, prevSource) => {
  return (dispatch) => {
    return deleteRequest(`product/${id}`, null, true, dispatch)
      .then(() => {
        let newProducts = [...prevSource];
        newProducts = newProducts.filter(product => product._id !== id)
        dispatch(setAllProducts(newProducts))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}

export const getProductByCategory = (id, clientId) => {
  return (dispatch) => {
    return getRequest(`product/category/${id}?client=${clientId}`, null, true, dispatch)
      .then(({ data }) => {
        let allProducts = [...data.data]
        allProducts = allProducts.map(product => {
          product.categoryName = product.category.name;
          product.key = product._id;
          return product;
        })
        dispatch(setAllProducts(allProducts))
      })
      .catch((error) => {
        openNotificationWithIcon('error', 'Error!', error.response.data.message);
      })
  }
}