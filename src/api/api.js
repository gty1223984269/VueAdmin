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
  return service.post(`${ip}/admin/backEnd/productList`, params).then(res => res.data);
};

export const saveProduct = params => {
  return service.post(`${ip}/admin/backEnd/productSave`, params).then(res => res.data);
};

export const deleteProduct = params => {
  return service.post(`${ip}/admin/backEnd/productDelete`, params).then(res => res.data);
};

export const uploadFile = params => {
  return service.post(`${ip}/admin/backEnd/uploadFile`, params).then(res => res.data);
};
export const login = params => {
  return service.post(`${ip}/admin/auth/login`, params).then(res => res.data);
};
export const setIp = () => {
  return ip;
};

let api = {
  getSysMenuList,
  getSysSchoolList,
  getProductList,
  saveProduct,
  deleteProduct,
  setIp,
  login,
};

export default api;
