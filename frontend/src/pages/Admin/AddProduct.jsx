import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Form, 
    Button, 
    Container, 
    Alert, 
    Spinner,
    Image
} from 'react-bootstrap';
import { fetchProductCategories, fetchProductSchema, addProduct } from '../../services/productService';

const AddProduct = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
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
    }, []);

    // Fetch schema when category is selected
    useEffect(() => {
        if (selectedCategory) {
            const getSchema = async () => {
                setLoading(true);
                const schema = await fetchProductSchema(selectedCategory);
                setProductSchema(schema);
                setLoading(false);
                
                // Reset form data
                const newFormData = new FormData();
                newFormData.append('category_name', selectedCategory);
                setFormData(newFormData);
                setFormValues({});
                setPreviewImages([]);
            };
            getSchema();
        }
    }, [selectedCategory]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
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
    };    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Clear previous images from formData
        if (formData.has('images')) {
            formData.delete('images');
        }
        
        // Validate image sizes (limit to 10MB per image)
        const maxSize = 10 * 1024 * 1024; // 10MB
        const invalidFiles = files.filter(file => file.size > maxSize);
        
        if (invalidFiles.length > 0) {
            setError(`Một số ảnh quá lớn (giới hạn 10MB mỗi ảnh): ${invalidFiles.map(f => f.name).join(', ')}`);
            return;
        }
        
        // Add each file to formData
        files.forEach(file => {
            formData.append('images', file);
        });
        
        // Create preview URLs
        const imageURLs = files.map(file => URL.createObjectURL(file));
        setPreviewImages(imageURLs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Build new FormData
            const newFormData = new FormData();
            newFormData.append('category_name', selectedCategory);

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
            }

            // Nếu có attributes riêng, gửi thêm:
            // const attributes = {...}; newFormData.append('attributes', JSON.stringify(attributes));

            const result = await addProduct(newFormData);
            if (result.success) {
                setSuccess('Sản phẩm đã được thêm thành công!');
                setSelectedCategory('');
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
    };

    // Render different field types based on the schema
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
                    <Form.Group className="mb-3" key={inputId}>
                        <Form.Label>{formattedFieldName}{fieldInfo.required ? '*' : ''}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name={inputId}
                            value={inputValue}
                            onChange={(e) => handleInputChange(e, fieldType, fieldName)}
                            required={fieldInfo.required}
                        />
                    </Form.Group>
                );
            case 'number':
                return (
                    <Form.Group className="mb-3" key={inputId}>
                        <Form.Label>{formattedFieldName}{fieldInfo.required ? '*' : ''}</Form.Label>
                        <Form.Control
                            type="number"
                            name={inputId}
                            value={inputValue}
                            onChange={(e) => handleInputChange(e, fieldType, fieldName)}
                            required={fieldInfo.required}
                        />
                    </Form.Group>
                );
            case 'date':
                return (
                    <Form.Group className="mb-3" key={inputId}>
                        <Form.Label>{formattedFieldName}{fieldInfo.required ? '*' : ''}</Form.Label>
                        <Form.Control
                            type="date"
                            name={inputId}
                            value={inputValue}
                            onChange={(e) => handleInputChange(e, fieldType, fieldName)}
                            required={fieldInfo.required}
                        />
                    </Form.Group>
                );
            default:
                return (
                    <Form.Group className="mb-3" key={inputId}>
                        <Form.Label>{formattedFieldName}{fieldInfo.required ? '*' : ''}</Form.Label>
                        <Form.Control
                            type="text"
                            name={inputId}
                            value={inputValue}
                            onChange={(e) => handleInputChange(e, fieldType, fieldName)}
                            required={fieldInfo.required}
                        />
                    </Form.Group>
                );
        }
    };

    return (
        <Container className="py-4">
            <Card>
                <Card.Header as="h4">Thêm Sản Phẩm Mới</Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label>Chọn Loại Sản Phẩm*</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                required
                            >
                                <option value="">-- Chọn loại sản phẩm --</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_name}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {loading && (
                            <div className="text-center my-4">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </Spinner>
                            </div>
                        )}

                        {productSchema && !loading && (
                            <>
                                <h5 className="mb-3">Thông Tin Chung</h5>
                                <Row>
                                    {Object.entries(productSchema.common_fields).map(([fieldName, fieldInfo]) => (
                                        <Col md={6} key={`common_${fieldName}`}>
                                            {renderField(fieldName, fieldInfo, 'common')}
                                        </Col>
                                    ))}
                                    
                                    {/* Image upload field */}
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Hình Ảnh Sản Phẩm</Form.Label>
                                            <Form.Control
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            <Form.Text className="text-muted">
                                                Chọn nhiều ảnh để tải lên (tối đa 5 ảnh).
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>

                                    {/* Image previews */}
                                    {previewImages.length > 0 && (
                                        <Col md={12}>
                                            <div className="mb-3">
                                                <p>Xem trước:</p>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {previewImages.map((url, index) => (
                                                        <Image
                                                            key={index}
                                                            src={url}
                                                            alt={`Preview ${index + 1}`}
                                                            thumbnail
                                                            style={{ maxHeight: '100px' }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </Col>
                                    )}
                                </Row>

                                <hr className="my-4" />

                                <h5 className="mb-3">Thông Tin Chi Tiết</h5>
                                <Row>
                                    {Object.entries(productSchema.specific_fields).map(([fieldName, fieldInfo]) => (
                                        <Col md={6} key={`specific_${fieldName}`}>
                                            {renderField(fieldName, fieldInfo, 'specific')}
                                        </Col>
                                    ))}
                                </Row>

                                <div className="d-flex justify-content-end mt-4">
                                    <Button 
                                        variant="secondary" 
                                        className="me-2"
                                        onClick={() => {
                                            setSelectedCategory('');
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
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang Xử Lý...' : 'Thêm Sản Phẩm'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddProduct;
