
import React, { useState, useEffect } from 'react';
import AdminApiService from '../../services/adminApiService'; 
import Swal from 'sweetalert2';
import { FiEdit, FiTrash, FiCheck, FiX,FiPlusCircle ,FiXCircle,FiRotateCcw} from 'react-icons/fi';
import { MdOutlineRestorePage,MdOutlineAddTask } from "react-icons/md";
import "../../components/CategoryManagement.css"

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false); // distinguish between Add and Update
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  useEffect(() => {
    fetchCategories();
    // fetchDeletedCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await AdminApiService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      alert('Failed to fetch categories');
    }
  };

  const fetchDeletedCategories = async () => {
    try {
      const response = await AdminApiService.getDeletedCategories();
      // Ensure response is an array or default to an empty array
      const deletedData = Array.isArray(response.data) ? response.data : [];
      setDeletedCategories(deletedData);

      // If no deleted categories, still show modal but with a message
      if (deletedData.length === 0) {
        setShowDeletedModal(true); // Make sure the modal stays open even if empty
      }
    } catch (error) {
      console.error('Failed to fetch deleted categories:', error);
      // alert('Failed to fetch deleted categories');
    }
  };

  const addCategory = async () => {
    try {
      setNewCategoryName('');  // Reset category name
      setModalVisible(false);  // Close modal
      await AdminApiService.createCategory({ name: newCategoryName });
      setModalVisible(false);  // Đóng modal
      setNewCategoryName('');  // Reset tên danh mục
      Swal.fire('Success', 'Category added successfully', 'success').then(() => {
        fetchCategories();  // Làm mới danh sách danh mục sau khi thêm
      });
    } catch (error) {
      console.error('Failed to add category:', error);
      Swal.fire('Error', 'Failed to add category', 'error').then(()=> {
        setModalVisible(true);
      });    
    }
  };

  const openUpdateModal = (category) => {
    setIsUpdateModal(true);
    setSelectedCategory(category);
    setEditCategoryName(category.name);
  };

  const handleUpdateCategory = async () => {
    try {
      setIsUpdateModal(false);
      await AdminApiService.updateCategory(selectedCategory._id, { name: editCategoryName });
      setSelectedCategory(null);
      setEditCategoryName('');
      // Close the modal and show a success alert
      Swal.fire('Success', 'Category updated successfully', 'success').then(() => {
        fetchCategories(); // Fetch categories again after success
      });
    } catch (error) {
      // console.error('Failed to update category:', error);
      Swal.fire('Error', 'Failed to update category', 'error').then(()=> {
        setIsUpdateModal(true);
      });
    }
  };

  const deleteCategoryHandler = async (id) => {
    const confirmMessage = 'Are you sure you want to delete this category?';
    
    const result = await Swal.fire({
      title: 'Confirm Deletion',
      text: confirmMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
      try {
        await AdminApiService.deleteCategory(id);
        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        fetchCategories();
        fetchDeletedCategories();  // Refresh the deleted categories list after deletion
      } catch (error) {
        console.error('Failed to delete category:', error);
        Swal.fire('Error', 'Failed to delete category', 'error');
      }
    }
  };

  const restoreCategoryHandler = async (categoryId) => {
    try {
      await AdminApiService.restoreCategory(categoryId);

      // Đảm bảo modal bị đóng trước khi hiển thị thông báo
      setShowDeletedModal(false);  // Đóng modal trước khi hiển thị thông báo
      fetchDeletedCategories();  // Làm mới danh sách category đã xóa sau khi khôi phục
      fetchCategories();

      // Hiển thị Swal.fire với tùy chọn để không bị đè
      Swal.fire({
        title: 'Restored!',
        text: 'Category has been restored.',
        icon: 'success',
        position: 'top',  // Đặt thông báo ở vị trí trên cùng để tránh đè modal
        backdrop: false,  // Tắt backdrop để tránh chặn modal
        showConfirmButton: true
      }).then(() => {
        // Sau khi thông báo được đóng, mở lại modal
        fetchDeletedCategories();  // Làm mới danh sách category đã xóa sau khi khôi phục

        fetchCategories();

        setShowDeletedModal(true);
      });
    } catch (error) {
      console.error('Failed to restore category:', error);
      Swal.fire('Error', 'Failed to restore category', 'error');
    }
  };
  return (
    <div className="category-management p-4">
     {/* Chuc nang add */}
     <div className="category-actions flex justify-between items-center mb-4">
      <div 
        className="icon-button" 
        onClick={() => setModalVisible(true)}>
        <FiPlusCircle />
      </div>
        {/* Modal for ADD category */}
                {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="text-xl font-semibold mb-4">
             Add Category ! 
            </h2>
            <input
              type="text"
              maxLength={20}
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <p className="text-gray-500 text-sm">{newCategoryName.length}/20 characters</p>
            <div  className="icon-button  py-2 px-4 rounded w-full" onClick={addCategory} >
            <MdOutlineAddTask />
            </div> 
            <div 
              className="icon-button mt-2 text-red-500 w-full" 
              onClick={() => setModalVisible(false)}>
              <FiXCircle />
            </div>
          </div>
        </div>
      )}

{/* chuc nang khoi phuc category */}
      <div 
        className="icon-button"
        onClick={() => {
          setShowDeletedModal(true);
          fetchDeletedCategories();
        }}> 
        <MdOutlineRestorePage />
      </div>
</div>
{/* danh muc category */}
      <ul className="mt-4"> 
        {categories.map((item, index) => (
          <li 
            key={item._id} 
            className={`category-item ${index % 2 === 0 ? 'fade-in' : ''}`}
            style={{ animation: 'fadeIn 1s ease' }}
          >
            <span>{item.name}</span>
            <div className="flex items-center">
              {/* nut edit category */}
              <div 
                className="icon-button mr-2"
                onClick={() => openUpdateModal(item)}>
                <FiEdit />
              </div>
              {/* nut xoa  */}
              <div 
                className="icon-button"
                onClick={() => deleteCategoryHandler(item._id)}>
                <FiTrash />
              </div>
            </div>
          </li>
        ))}
      </ul>



      {/* Modal for updating category */}
      {isUpdateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="text-xl font-semibold mb-4">
              Update Category
            </h2>
            <input
              type="text"
              maxLength={20}
              placeholder="Category Name"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <p className="text-gray-500 text-sm">{editCategoryName.length}/20 characters</p>
            <div 
              className="icon-button  py-2 px-4 rounded w-full"
              onClick={handleUpdateCategory}>
              <MdOutlineAddTask />
            </div> 
            <div 
              className="icon-button mt-2 text-red-500 w-full" 
              onClick={() => setIsUpdateModal(false)}>
              <FiXCircle />
            </div>
          </div>
        </div>
      )}

      {/* Modal for showing deleted categories */}
      {showDeletedModal && (
        <div className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Deleted Categories</h3>
            {deletedCategories.length === 0 ? (
              <p>No deleted categories available.</p>  
            ) : (
              <ul>
                {deletedCategories.map(item => (
                  <li key={item._id} className="flex justify-between items-center mb-2">
                    <span>{item.name}</span>
                    <div 
                      className="icon-button bg-green-500 text-white py-1 px-3 rounded"
                      onClick={() => restoreCategoryHandler(item._id)}>
                      <FiRotateCcw />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div 
              className="icon-button mt-2 text-red-500 w-full"
              onClick={() => setShowDeletedModal(false)}>
              <FiXCircle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
