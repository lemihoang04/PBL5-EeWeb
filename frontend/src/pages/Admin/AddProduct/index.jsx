import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { fetchProductCategories, fetchProductSchema, addProduct } from '../../../services/productService';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [productSchema, setProductSchema] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Fetch product categories when component mounts
    useEffect(() => {
        const getProductCategories = async () => {
            try {
                setLoading(true);
                const response = await fetchProductCategories();
                if (response && Array.isArray(response)) {
                    setCategories(response);
                }
            } catch (error) {
                console.error("Error fetching product categories:", error);
                setMessage({ type: 'danger', text: 'Could not fetch product categories. Please try again later.' });
            } finally {
                setLoading(false);
            }
        };

        getProductCategories();
    }, []);

    // Fetch product schema when category changes
    useEffect(() => {
        const getProductSchema = async () => {
            if (!selectedCategory) return;
            
            try {
                setLoading(true);
                const response = await fetchProductSchema(selectedCategory);
                if (response) {
                    setProductSchema(response);
                    // Initialize form values with empty strings or defaults
                    initializeFormValues(response);
                }
            } catch (error) {
                console.error(`Error fetching schema for ${selectedCategory}:`, error);
                setMessage({ type: 'danger', text: `Could not fetch form fields for ${selectedCategory}. Please try again later.` });
            } finally {
                setLoading(false);
            }
        };

        getProductSchema();
    }, [selectedCategory]);

    // Initialize form values based on schema
    const initializeFormValues = (schema) => {
        const newValues = {};
        
        // Initialize common fields
        if (schema.common_fields) {
            Object.entries(schema.common_fields).forEach(([fieldName, fieldInfo]) => {
                newValues[`common_${fieldName}`] = fieldInfo.default || '';
            });
        }
        
        // Initialize specific fields
        if (schema.specific_fields) {
            Object.entries(schema.specific_fields).forEach(([fieldName, fieldInfo]) => {
                newValues[`specific_${fieldName}`] = fieldInfo.default || '';
            });
        }
        
        setFormValues(newValues);
    };

    // Handle category selection
    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setFormValues({});
        setErrors({});
        setImageFiles([]);
        setImagePreviews([]);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Validate files (size, type, etc.)
        const validFiles = files.filter(file => {
            const isImage = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
            
            if (!isImage) {
                setMessage({ type: 'warning', text: `File ${file.name} is not an image.` });
            } else if (!isValidSize) {
                setMessage({ type: 'warning', text: `File ${file.name} exceeds 5MB limit.` });
            }
            
            return isImage && isValidSize;
        });
        
        if (validFiles.length === 0) return;
        
        setImageFiles(validFiles);
        
        // Create image previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        
        // Validate common fields
        if (productSchema?.common_fields) {
            Object.entries(productSchema.common_fields).forEach(([fieldName, fieldInfo]) => {
                const fullFieldName = `common_${fieldName}`;
                const value = formValues[fullFieldName];
                
                if (fieldInfo.required && (!value || value.trim() === '')) {
                    newErrors[fullFieldName] = `${fieldName} is required`;
                }
            });
        }
        
        // Validate specific fields
        if (productSchema?.specific_fields) {
            Object.entries(productSchema.specific_fields).forEach(([fieldName, fieldInfo]) => {
                const fullFieldName = `specific_${fieldName}`;
                const value = formValues[fullFieldName];
                
                if (fieldInfo.required && (!value || value.trim() === '')) {
                    newErrors[fullFieldName] = `${fieldName} is required`;
                }
            });
        }
        
        // Validate images
        if (imageFiles.length === 0) {
            newErrors.images = 'At least one image is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setMessage({ type: 'danger', text: 'Please fix the errors before submitting.' });
            return;
        }
        
        try {
            setSubmitting(true);
            setMessage({ type: 'info', text: 'Adding product, please wait...' });
            
            // Create FormData object
            const formData = new FormData();
            
            // Add category
            formData.append('category_name', selectedCategory);
            
            // Add form values
            Object.entries(formValues).forEach(([key, value]) => {
                formData.append(key, value);
            });
            
            // Add images
            imageFiles.forEach(file => {
                formData.append('images', file);
            });
            
            // Submit the form
            const result = await addProduct(formData);
            
            if (result.success) {
                setMessage({ type: 'success', text: 'Product added successfully!' });
                
                // Redirect after a brief delay
                setTimeout(() => {
                    navigate('/admin');
                }, 2000);
            } else {
                setMessage({ type: 'danger', text: result.message || 'Failed to add product. Please try again.' });
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            setMessage({ type: 'danger', text: 'An error occurred. Please try again later.' });
        } finally {
            setSubmitting(false);
        }
    };

    // Render form fields based on schema
    const renderFormFields = () => {
        if (!productSchema) return null;
        
        return (
            <>
                {/* Common Fields */}
                <Card className="mb-4">
                    <Card.Header as="h5">Basic Product Information</Card.Header>
                    <Card.Body>
                        {productSchema.common_fields && 
                            Object.entries(productSchema.common_fields).map(([fieldName, fieldInfo]) => {
                                // Skip image field as we're handling it separately
                                if (fieldName === 'image') return null;
                                
                                const fullFieldName = `common_${fieldName}`;
                                
                                return (
                                    <Form.Group as={Row} className="mb-3" key={fullFieldName}>
                                        <Form.Label column sm={3} className="text-capitalize">
                                            {fieldName.replace(/_/g, ' ')}
                                            {fieldInfo.required && <span className="text-danger">*</span>}
                                        </Form.Label>
                                        <Col sm={9}>
                                            {fieldInfo.type === 'textarea' ? (
                                                <Form.Control 
                                                    as="textarea" 
                                                    rows={3}
                                                    name={fullFieldName}
                                                    value={formValues[fullFieldName] || ''}
                                                    onChange={handleInputChange}
                                                    isInvalid={!!errors[fullFieldName]}
                                                />
                                            ) : (
                                                <Form.Control 
                                                    type={fieldInfo.type || 'text'}
                                                    name={fullFieldName}
                                                    value={formValues[fullFieldName] || ''}
                                                    onChange={handleInputChange}
                                                    isInvalid={!!errors[fullFieldName]}
                                                />
                                            )}
                                            <Form.Control.Feedback type="invalid">
                                                {errors[fullFieldName]}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                );
                            })
                        }
                    </Card.Body>
                </Card>
                
                {/* Specific Fields */}
                {productSchema.specific_fields && Object.keys(productSchema.specific_fields).length > 0 && (
                    <Card className="mb-4">
                        <Card.Header as="h5">{selectedCategory} Specific Details</Card.Header>
                        <Card.Body>
                            {Object.entries(productSchema.specific_fields).map(([fieldName, fieldInfo]) => {
                                const fullFieldName = `specific_${fieldName}`;
                                
                                return (
                                    <Form.Group as={Row} className="mb-3" key={fullFieldName}>
                                        <Form.Label column sm={3} className="text-capitalize">
                                            {fieldName.replace(/_/g, ' ')}
                                            {fieldInfo.required && <span className="text-danger">*</span>}
                                        </Form.Label>
                                        <Col sm={9}>
                                            {fieldInfo.type === 'textarea' ? (
                                                <Form.Control 
                                                    as="textarea" 
                                                    rows={3}
                                                    name={fullFieldName}
                                                    value={formValues[fullFieldName] || ''}
                                                    onChange={handleInputChange}
                                                    isInvalid={!!errors[fullFieldName]}
                                                />
                                            ) : (
                                                <Form.Control 
                                                    type={fieldInfo.type || 'text'}
                                                    name={fullFieldName}
                                                    value={formValues[fullFieldName] || ''}
                                                    onChange={handleInputChange}
                                                    isInvalid={!!errors[fullFieldName]}
                                                />
                                            )}
                                            <Form.Control.Feedback type="invalid">
                                                {errors[fullFieldName]}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                );
                            })}
                        </Card.Body>
                    </Card>
                )}
                
                {/* Image Upload */}
                <Card className="mb-4">
                    <Card.Header as="h5">Product Images</Card.Header>
                    <Card.Body>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>
                                Upload Images <span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control 
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    isInvalid={!!errors.images}
                                />
                                <Form.Text className="text-muted">
                                    You can select multiple images. Maximum 5MB per image.
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {errors.images}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        
                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="image-previews mt-3">
                                <Row>
                                    {imagePreviews.map((preview, index) => (
                                        <Col xs={6} md={3} key={index} className="mb-3">
                                            <img 
                                                src={preview} 
                                                alt={`Preview ${index+1}`} 
                                                className="img-thumbnail preview-image"
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </>
        );
    };

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Add New Product</h2>
                    <p>Fill in the details below to add a new product to the catalog.</p>
                </Col>
                <Col xs="auto">
                    <Button variant="outline-secondary" onClick={() => navigate('/admin')}>
                        Back to Dashboard
                    </Button>
                </Col>
            </Row>
            
            {/* Messages */}
            {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                </Alert>
            )}
            
            {/* Category Selection */}
            <Card className="mb-4">
                <Card.Header as="h5">Select Product Category</Card.Header>
                <Card.Body>
                    <Form.Group as={Row}>
                        <Form.Label column sm={3}>
                            Product Category <span className="text-danger">*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                disabled={loading || categories.length === 0}
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_name}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Card.Body>
            </Card>
            
            {/* Loading Indicator */}
            {loading && (
                <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading form fields...</p>
                </div>
            )}
            
            {/* Product Form */}
            {selectedCategory && productSchema && !loading && (
                <Form onSubmit={handleSubmit}>
                    {renderFormFields()}
                    
                    {/* Submit Button */}
                    <div className="d-flex justify-content-end">
                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg" 
                            disabled={submitting}
                            className="px-5"
                        >
                            {submitting ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Processing...
                                </>
                            ) : (
                                'Add Product'
                            )}
                        </Button>
                    </div>
                </Form>
            )}
        </Container>
    );
};

export default AddProduct;
