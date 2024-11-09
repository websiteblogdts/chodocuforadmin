import React, { useState, useEffect } from 'react';
import AdminApiService from '../../services/adminApiService'; // Giả sử bạn có service này
import '../../components/ProductManagement.css'; // Giả sử bạn có file CSS cho styles
import Swal from 'sweetalert2';  // Import SweetAlert2

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [rejectedReason, setRejectionReason] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewStatus, setViewStatus] = useState('all'); // 'all', 'approved', 'pending', 'rejected'

  // useEffect to fetch products when viewStatus changes
  useEffect(() => {
    fetchProducts();
  }, [viewStatus]); // Only run fetchProducts when viewStatus changes

  const fetchProducts = async () => {
    try {
      let response;

      if (viewStatus === 'approved') {
        response = await AdminApiService.getApprovedProducts();
      } else if (viewStatus === 'pending') {
        response = await AdminApiService.getPendingProducts();
      } else if (viewStatus === 'rejected') {
        response = await AdminApiService.getRejectedProducts();
      } else {
        response = await AdminApiService.getProductsByApprovalStatus();
      }

      console.log('Fetched Products:', response.data);

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        const sortedData = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setProducts(sortedData);
      } else if (Array.isArray(data) && data.length === 0) {
        Swal.fire('Không tìm thấy sản phẩm nào.');
        setProducts([]);
      } else {
        Swal.fire('Dữ liệu sản phẩm không hợp lệ.');
        console.warn('Invalid data structure:', data);
      }
    } catch (err) {
      Swal.fire('Không thể tải dữ liệu sản phẩm.');
      console.error('Error fetching products:', err);
    }
  };


  const toggleProductApproval = async (productId) => {
    // Hiển thị thông báo xác minh trước khi duyệt sản phẩm
    const result = await Swal.fire({
      title: 'Xác nhận duyệt sản phẩm?',
      text: "Bạn chắc chắn muốn duyệt sản phẩm này?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Duyệt',
      cancelButtonText: 'Hủy',
    });
  
    if (result.isConfirmed) {
      try {
        await AdminApiService.updateApprovedStatus(productId);
        fetchProducts(); // Cập nhật lại danh sách sau khi duyệt sản phẩm
        Swal.fire('Sản phẩm đã được duyệt!', '', 'success');
      } catch (err) {
        console.error('Error toggling product approval:', err);
        Swal.fire('Có lỗi xảy ra. Vui lòng thử lại!', '', 'error');
      }
    }
  };
  

  const openRejectionModal = (productId) => {
    setSelectedProductId(productId);
    setModalVisible(true);
  };
  const submitRejection = async (productId, rejectedReason) => {
    try {
      console.log('Sending rejection for product:', productId);
      console.log('Rejection reason:', rejectedReason);
      
      // Gửi yêu cầu từ chối sản phẩm
      const response = await AdminApiService.rejectProduct(productId, rejectedReason);
      
      console.log('Rejection response from backend:', response.data);
      
      // Kiểm tra xem từ chối có thành công hay không
      if (response.data.admin_rejected) {
        console.log('Sản phẩm đã bị từ chối thành công.');
        
        // Cập nhật lại danh sách sản phẩm
        fetchProducts();
        
        // Hiển thị thông báo xác nhận đã gửi lý do từ chối thành công
        Swal.fire({
          title: 'Thành công!',
          text: 'Lý do từ chối đã được gửi.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        console.log('Có lỗi xảy ra khi từ chối sản phẩm.');
        Swal.fire({
          title: 'Lỗi',
          text: 'Có lỗi xảy ra khi từ chối sản phẩm.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      console.error('Error rejecting product:', err);
      Swal.fire({
        title: 'Lỗi',
        text: 'Không thể từ chối sản phẩm. Vui lòng thử lại.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  
  
  
  
  const navigateToProductDetail = (productId) => {
    // Điều hướng tới màn hình chi tiết sản phẩm
    console.log(`Navigating to product detail for product ID: ${productId}`);
  };
  const renderProduct = (item) => {
    // Log từng sản phẩm để kiểm tra dữ liệu
    console.log('Rendering Product:', item);
  
    const firstImageUri = item.images && item.images.length > 0 ? item.images[0] : null;
    const backgroundColor = item.admin_approved ? '#e0f7fa' : item.admin_rejected ? '#ffebee' : '#fff';
  
    return (
      <div
        onClick={() => navigateToProductDetail(item._id)}
        className="product-container"
        style={{ backgroundColor }}
        key={item._id}
      >
        <p className="status">
          {item.admin_rejected ? 'Đã từ chối' : item.admin_approved ? 'Đã duyệt' : 'Đang chờ duyệt'}
        </p>
  
        {firstImageUri && <img src={firstImageUri} alt={item.name} className="image" />}
        
        <p className="name">{item.name}</p>
  
        {/* Log lý do từ chối */}
        {item.admin_rejected && (
          <p style={{ color: '#FF5733' }}>
            Lý do từ chối: {item.admin_rejected_reason || 'Không có lý do'}
          </p>
        )}
  
        <p className="price">${item.price}</p>
  
        {/* Các nút Duyệt, Từ chối */}
        {!item.admin_rejected && (
          <button
            className={`approval-button ${item.admin_approved ? 'unapprove' : 'approve'}`}
            onClick={() => toggleProductApproval(item._id)}
          >
            {item.admin_approved ? 'Unapprove' : 'Approve'}
          </button>
        )}
  
        {!item.admin_approved && (
          <button
            className="reject-button"
            onClick={() => openRejectionModal(item._id)}
          >
            Reject
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className="container">
      <div className="tabs">
        <button onClick={() => setViewStatus('approved')} className={`tab-button ${viewStatus === 'approved' ? 'active' : ''}`}>Đã duyệt</button>
        <button onClick={() => setViewStatus('pending')} className={`tab-button ${viewStatus === 'pending' ? 'active' : ''}`}>Chưa duyệt</button>
        <button onClick={() => setViewStatus('rejected')} className={`tab-button ${viewStatus === 'rejected' ? 'active' : ''}`}>Đã từ chối</button>
      </div>

      {products.length === 0 ? (
        <p className="empty-text">Danh sách trống</p>
      ) : (
        <div className="product-list">
          {products.map((item) => renderProduct(item))}
        </div>
      )}

      {/* Modal nhập lý do từ chối */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nhập lý do từ chối</h2>
            <input
              type="text"
              value={rejectedReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Lý do từ chối"
              className="input"
            />
            <div className="modal-buttons">
              <button
                className="submit-button"
                onClick={async () => {
                  await submitRejection(selectedProductId, rejectedReason);
                  setModalVisible(false);
                }}
              >
                Submit
              </button>
              <button className="cancel-button" onClick={() => setModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
