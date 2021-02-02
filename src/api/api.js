import axios from 'axios';

let ip = 'http://127.0.0.1:8360';
let token = localStorage.getItem('token');
// create an axios instance
const service = axios.create({
  baseURL: '/api', // api的base_url
  timeout: 5000, // request timeout
  headers: { 'x-nideshop-token': token }
});

export const getSysMenuList = params => {
  return service.post(`${ip}/admin/backEnd/menuList`, params).then(res => res.data);
};

export const getSysSchoolList = params => {
  return service.post(`${ip}/admin/backEnd/schoolList`, params).then(res => res.data);
};

export const getProductList = params => {
  return service.post(`${ip}/admin/goods/index`, params).then(res => res.data);
};

export const goodsSave = params => {
  return service.post(`${ip}/admin/goods/goodsSave`, params).then(res => res.data);
};

export const deleteProduct = params => {
  return service.post(`${ip}/admin/goods/destory`, params).then(res => res.data);
};

export const uploadFile = params => {
  return service.post(`${ip}/admin/backEnd/uploadFile`, params).then(res => res.data);
};
export const login = params => {
  return service.post(`${ip}/admin/auth/login`, params).then(res => res.data);
};
export const getCategoryList = params => {
  return service.post(`${ip}/admin/category/categoryList`, params).then(res => res.data);
};
export const PostCategoryDelete = params => {
  return service.post(`${ip}/admin/category/categoryDelete`, params).then(res => res.data);
};
export const PostCategoryAdd = params => {
  return service.post(`${ip}/admin/category/categoryAdd`, params).then(res => res.data);
};
export const setIp = () => {
  return ip;
};
export const PostCategoryList = params => {
  return service.post(`${ip}/admin/category/allCategory`, params).then(res => res.data);
};
export const PostBrandList = params => {
  return service.post(`${ip}/admin/category/allBrand`, params).then(res => res.data);
};
let api = {
  getSysMenuList,
  getSysSchoolList,
  getProductList,
  goodsSave,
  deleteProduct,
  setIp,
  login,
  getCategoryList,
  PostCategoryDelete,
  PostCategoryAdd,
  PostCategoryList,
  PostBrandList,
};

export default api;
