import axiosClient from './axiosClient';

const productService = {
  // 1. Lấy tất cả sản phẩm (Hỗ trợ Phân trang, Lọc danh mục, Tìm kiếm từ khóa & Sắp xếp giá)
  getAll(page = 0, size = 12, cid = '', keywords = '', sort = 'default') {
    let url = `/api/products?page=${page}&size=${size}`;
    if (cid && cid !== 'null') url += `&cid=${encodeURIComponent(cid)}`;
    if (keywords) url += `&keywords=${encodeURIComponent(keywords)}`;
    if (sort) url += `&sort=${encodeURIComponent(sort)}`;
    return axiosClient.get(url);
  },

  // 2. Lấy chi tiết 1 sản phẩm theo ID
  getById(id) {
    return axiosClient.get(`/api/products/${id}`);
  },

  // 3. Lọc sản phẩm theo danh mục riêng (có phân trang 12 & sắp xếp)
  getByCategory(cid, page = 0, size = 12, sort = 'default') {
    return axiosClient.get(`/api/products/category/${encodeURIComponent(cid)}?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`);
  },

  // 4. Tìm kiếm theo từ khóa riêng (có phân trang 12 & sắp xếp)
  search(keywords, page = 0, size = 12, sort = 'default') {
    return axiosClient.get(`/api/products/search?keywords=${encodeURIComponent(keywords)}&page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`);
  }
};

export default productService;