import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Form, 
    Button, 
    Alert, 
    Spinner,
    Image
} from 'react-bootstrap';
import { fetchProductCategories, fetchProductSchema, addProduct } from '../../services/productService';
import { FiPackage, FiInfo, FiList, FiImage, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import UploadImage from '../../components/UploadImage';
import './AddProduct.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [productSchema, setProductSchema] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(new FormData());
    const [formValues, setFormValues] = useState({});
    const [previewImages, setPreviewImages] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch categories when component mounts
    useEffect(() => {
        const getCategories = async () => {
            const response = await fetchProductCategories();
            if (Array.isArray(response)) {
                setCategories(response);
            }
        };
        getCategories();
    }, []);    // Fetch schema when category is selected
    useEffect(() => {
    if (selectedCategory && selectedCategoryId) {
        const getSchema = async () => {
            setLoading(true);
            const schema = await fetchProductSchema(selectedCategory);

            // Bổ sung category_id vào common_fields nếu chưa có
            if (!schema.common_fields.hasOwnProperty('category_id')) {
                schema.common_fields = {
                    category_id: { type: 'text', required: true },
                    ...schema.common_fields
                };
            }

            setProductSchema(schema);
            setLoading(false);

            // Reset form data
            const newFormData = new FormData();
            newFormData.append('category_name', selectedCategory);
            newFormData.append('category_id', selectedCategoryId);
            setFormData(newFormData);

            // Khởi tạo luôn formValues cho category_id
            setFormValues({ common_category_id: selectedCategoryId });
            setPreviewImages([]);
        };
        getSchema();
    }
}, [selectedCategory, selectedCategoryId]);
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        
        if (!categoryId) {
            setSelectedCategoryId(null);
            setSelectedCategory('');
            return;
        }
        
        // Find the selected category object to get its name
        const selectedCat = categories.find(cat => cat.category_id.toString() === categoryId.toString());
        if (selectedCat) {
            setSelectedCategoryId(categoryId);
            setSelectedCategory(selectedCat.category_name);
            
            // Update form data immediately with the new category
            const updatedFormData = new FormData();
            updatedFormData.append('category_id', categoryId);
            updatedFormData.append('category_name', selectedCat.category_name);
            setFormData(updatedFormData);
        }
        
        setError('');
        setSuccess('');
    };

    const handleInputChange = (e, fieldType, fieldName) => {
        const { value } = e.target;
        
        // Update form values for controlled inputs
        setFormValues(prev => ({
            ...prev,
            [`${fieldType}_${fieldName}`]: value
        }));
        
        // Update form data
        formData.set(`${fieldType}_${fieldName}`, value);
    };    // New function to handle Cloudinary uploads
    const handleCloudinaryImageUpload = (cloudinaryUrl) => {
        // Cập nhật formValues để hiển thị trên giao diện
        setFormValues(prev => {
            let newImage = cloudinaryUrl;
            
            // Nếu đã có hình ảnh, ghép vào chuỗi hiện có
            if (prev['common_image']) {
                newImage = prev['common_image'] + '; ' + cloudinaryUrl;
            }
            
            return {
                ...prev,
                'common_image': newImage
            };
        });
        
        // Add to form data
        const updatedFormData = formData;
        if (updatedFormData.has('cloudinary_image_url')) {
            updatedFormData.delete('cloudinary_image_url');
        }
        updatedFormData.append('cloudinary_image_url', cloudinaryUrl);
        
        // If we have multiple images, create a semicolon-separated list
        if (updatedFormData.has('common_image')) {
            const currentImages = updatedFormData.get('common_image');
            updatedFormData.delete('common_image');
            updatedFormData.append('common_image', currentImages + '; ' + cloudinaryUrl);
        } else {
            updatedFormData.append('common_image', cloudinaryUrl);
        }
        
        setFormData(updatedFormData);
        
        // Add to preview images
        setPreviewImages(prevImages => [...prevImages, cloudinaryUrl]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        if (!selectedCategoryId) {
            setError('Vui lòng chọn loại sản phẩm trước khi gửi');
            setLoading(false);
            return;
        }
        
        try {
            // Build new FormData
            const newFormData = new FormData();
            newFormData.append('category_name', selectedCategory);
            
            // Luôn thêm category ID
            newFormData.append('category_id', selectedCategoryId);

            // Common fields
            Object.entries(productSchema.common_fields).forEach(([fieldName]) => {
                const value = formValues[`common_${fieldName}`] || '';
                newFormData.append(`common_${fieldName}`, value);
            });

            // Specific fields (đặc thù) - gửi đúng dạng object JSON
            const specificFields = {};
            Object.entries(productSchema.specific_fields).forEach(([fieldName]) => {
                const value = formValues[`specific_${fieldName}`] || '';
                if (value) specificFields[fieldName] = value;
            });
            newFormData.append('specific_fields', JSON.stringify(specificFields));

            // Images
            if (formData.getAll('images').length > 0) {
                formData.getAll('images').forEach((file) => {
                    newFormData.append('images', file);
                });
            }            // Nếu có attributes riêng, gửi thêm:
            // const attributes = {...}; newFormData.append('attributes', JSON.stringify(attributes));

            // Log để kiểm tra
            console.log("Category being submitted:", {
                category_id: newFormData.get('category_id'),
                category_name: newFormData.get('category_name')
            });

            const result = await addProduct(newFormData);if (result.success) {
                setSuccess('Sản phẩm đã được thêm thành công!');
                setSelectedCategory('');
                setSelectedCategoryId(null);
                setProductSchema(null);
                setFormValues({});
                setPreviewImages([]);
                setFormData(new FormData());
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi thêm sản phẩm.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };    // Render different field types based on the schema
    const renderField = (fieldName, fieldInfo, fieldType) => {
        const inputId = `${fieldType}_${fieldName}`;
        const inputValue = formValues[inputId] || '';
        
        // Convert field name to a more readable format
        const formattedFieldName = fieldName
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
        switch (fieldInfo.type) {
            case 'textarea':
                return (
                    <Form.Group className="mb-3 ap-form-group" key={inputId}>
                        <Form.Label className="ap-form-label">
                            {formattedFieldName}{fieldInfo.required ? '*' : ''}
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name={inputId}
                            value={inputValue}
                            onChange={(e) => handleInputChange(e, fieldType, fieldName)}
                            required={fieldInfo.required}
                            className="ap-form-control"
                        />
                    </Form.Group>
                );
            case 'number':
                return (
                    <Form.Group className="mb-3 ap-form-group" key={inputId}>
                        <Form.Label className="ap-form-label">
                            {formattedFieldName}{fieldInfo.required ? '*' : ''}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            name={inputId}
                            value={inputValue}
                            onChange={(e) => handleInputChange(e, fieldType, fieldName)}
                            required={fieldInfo.required}
                            className="ap-form-control"
                        />
                    </Form.Group>
                );
            case 'date':
                return (
                    <Form.Group className="mb-3 ap-form-group" key={inputId}>
                        <Form.Label className="ap-form-label">
                            {formattedFieldName}{fieldInfo.required ? '*' : ''}
                        </Form.Label>
                        <Form.Control
                            type="date"
                            name={inputId}
                            value={inputValue}
                            onChange={(e) => handleInputChange(e, fieldType, fieldName)}
                            required={fieldInfo.required}
                            className="ap-form-control"
                        />
                    </Form.Group>
                );
            default:
                return (
                    <Form.Group className="mb-3 ap-form-group" key={inputId}>
                        <Form.Label className="ap-form-label">
                            {formattedFieldName}{fieldInfo.required ? '*' : ''}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name={inputId}
                            value={inputValue}
                            onChange={(e) => handleInputChange(e, fieldType, fieldName)}
                            required={fieldInfo.required}
                            className="ap-form-control"
                        />
                    </Form.Group>
                );
        }
    };return (
        <div className="ap-add-product-container">            <Card className="ap-add-product-card">
                <Card.Header as="h4" className="ap-add-product-header d-flex justify-content-between align-items-center">
                    <div>
                        <FiPackage /> Thêm Sản Phẩm Mới
                    </div>
                    <Button 
                        variant="light"
                        className="ap-btn-back"
                        onClick={() => navigate('/admin')}
                    >
                        <FiArrowLeft /> Quay Lại
                    </Button>
                </Card.Header>
                <Card.Body className="ap-add-product-body">
                    {error && <Alert variant="danger" className="ap-alert ap-alert-danger">{error}</Alert>}
                    {success && <Alert variant="success" className="ap-alert ap-alert-success">{success}</Alert>}<Form onSubmit={handleSubmit}>                        <Form.Group className="mb-4">
                            <Form.Label className="ap-form-label">Chọn Loại Sản Phẩm*</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedCategoryId || ''}
                                onChange={handleCategoryChange}
                                required
                                isInvalid={!selectedCategoryId && error.includes('loại sản phẩm')}
                                className="ap-form-control ap-form-control-select"
                            >
                                <option value="">-- Chọn loại sản phẩm --</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                Vui lòng chọn loại sản phẩm
                            </Form.Control.Feedback>                            {selectedCategoryId && (
                                <Form.Text className="ap-form-text">
                                    Đã chọn: {selectedCategory} (ID: {selectedCategoryId})
                                </Form.Text>
                            )}
                        </Form.Group>                        {loading && (
                            <div className="ap-spinner-container">
                                <Spinner animation="border" role="status" className="ap-spinner">
                                    <span className="visually-hidden">Đang tải...</span>
                                </Spinner>
                            </div>
                        )}

                        {productSchema && !loading && (
                            <>                                <h5 className="ap-section-title">
                                    <FiInfo /> Thông Tin Chung
                                </h5>
                                <Row>
                                    {Object.entries(productSchema.common_fields).map(([fieldName, fieldInfo]) => (
                                        <Col md={6} key={`common_${fieldName}`}>
                                            {renderField(fieldName, fieldInfo, 'common')}
                                        </Col>
                                    ))}                                    {/* Image upload field */}
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ảnh sản phẩm</Form.Label>
                                            <div className="ap-file-input-container">
                                                {/* Replace traditional file input with Cloudinary upload component */}
                                                <UploadImage onImageUploaded={handleCloudinaryImageUpload} />
                                                <p>Tải lên nhiều ảnh bằng cách sử dụng nút tải lên nhiều lần</p>
                                            </div>
                                            
                                            {/* Hiển thị và chỉnh sửa URL ảnh đã upload */}
                                            {formValues['common_image'] && (
                                                <div className="mt-3">
                                                    <Form.Label>URL ảnh đã tải lên (có thể chỉnh sửa)</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        value={formValues['common_image'] || ''}
                                                        onChange={(e) => handleInputChange(e, 'common', 'image')}
                                                        className="ap-form-control"
                                                        placeholder="URL ảnh sẽ hiển thị ở đây sau khi tải lên"
                                                    />
                                                    <Form.Text className="text-muted">
                                                        Nhiều URL được phân cách bằng dấu chấm phẩy (;)
                                                    </Form.Text>
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    
                                    {/* Image previews */}
                                    {previewImages.length > 0 && (
                                        <Col md={12}>
                                            <div className="ap-image-preview-container">
                                                <div className="ap-image-preview-title">
                                                    <FiImage /> Xem trước ảnh sản phẩm:
                                                </div>
                                                <div className="ap-image-preview-grid">
                                                    {previewImages.map((url, index) => (
                                                        <div className="ap-image-thumbnail" key={index}>
                                                            <Image
                                                                src={url}
                                                                alt={`Preview ${index + 1}`}
                                                                fluid
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Col>
                                    )}
                                </Row>                                <div className="ap-divider"></div>

                                <h5 className="ap-section-title">
                                    <FiList /> Thông Tin Chi Tiết
                                </h5>
                                <Row>
                                    {Object.entries(productSchema.specific_fields).map(([fieldName, fieldInfo]) => (
                                        <Col md={6} key={`specific_${fieldName}`}>
                                            {renderField(fieldName, fieldInfo, 'specific')}
                                        </Col>
                                    ))}
                                </Row>                                <div className="d-flex justify-content-end mt-4">                                    
                                    <Button 
                                        variant="secondary" 
                                        className="me-2 ap-btn ap-btn-secondary"
                                        onClick={() => {
                                            setSelectedCategory('');
                                            setSelectedCategoryId(null);
                                            setProductSchema(null);
                                            setFormValues({});
                                            setPreviewImages([]);
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="primary"
                                        className="ap-btn ap-btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang Xử Lý...' : 'Thêm Sản Phẩm'}
                                    </Button>
                                </div></>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AddProduct;
