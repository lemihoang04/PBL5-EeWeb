import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import UploadImage from '../components/UploadImage';

const TestUpload = () => {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageUploaded = (imageUrl) => {
    setUploadedImages([...uploadedImages, imageUrl]);
    console.log("Image uploaded successfully:", imageUrl);
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Test Image Upload</h1>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Upload Image</Card.Header>
            <Card.Body>
              <UploadImage onImageUploaded={handleImageUploaded} />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>Uploaded Images ({uploadedImages.length})</Card.Header>
            <Card.Body>
              {uploadedImages.length === 0 ? (
                <p>No images uploaded yet</p>
              ) : (
                <div className="image-grid">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="image-item">
                      <img 
                        src={url} 
                        alt={`Uploaded ${index + 1}`} 
                        style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                      />
                      <div className="image-url">{url}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <style jsx>{`
        .image-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .image-item {
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 10px;
        }
        
        .image-url {
          font-size: 12px;
          word-break: break-all;
          margin-top: 5px;
          padding: 5px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
      `}</style>
    </Container>
  );
};

export default TestUpload;
