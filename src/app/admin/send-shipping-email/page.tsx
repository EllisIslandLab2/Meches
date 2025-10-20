'use client';

import { useState, FormEvent } from 'react';

export default function SendShippingEmailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    orderId: '',
    email: '',
    customerName: '',
    trackingNumber: '',
    carrier: 'USPS'
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      // Verify password server-side for security
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.authenticated) {
        setIsAuthenticated(true);
        setPassword(''); // Clear password from memory
      } else {
        setStatus({ type: 'error', message: 'Invalid password' });
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setStatus({ type: 'error', message: 'Authentication error. Please try again.' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/send-shipping-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: `Shipping notification sent successfully to ${formData.email}!`
        });
        // Clear form
        setFormData({
          orderId: '',
          email: '',
          customerName: '',
          trackingNumber: '',
          carrier: 'USPS'
        });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to send shipping notification'
        });
      }
    } catch (error) {
      console.error('Error sending shipping notification:', error);
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f0',
        fontFamily: 'Georgia, serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{
            color: '#8B4513',
            marginBottom: '20px',
            textAlign: 'center'
          }}>Admin Access</h1>
          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: 'bold'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
            {status.type === 'error' && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                {status.message}
              </div>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#8B4513',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f0',
      padding: '40px 20px',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: '#8B4513',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          Send Shipping Notification
        </h1>
        <p style={{
          color: '#666',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          Meche's Creations - Admin Panel
        </p>

        {status.message && (
          <div style={{
            padding: '15px',
            backgroundColor: status.type === 'success' ? '#d4edda' : '#fee',
            color: status.type === 'success' ? '#155724' : '#c33',
            borderRadius: '4px',
            marginBottom: '20px',
            border: `1px solid ${status.type === 'success' ? '#c3e6cb' : '#fcc'}`
          }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Order ID *
            </label>
            <input
              type="text"
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              placeholder="e.g., lOaqyeyx6a8k15FBtgFPM74ChXTZY"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Customer Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="customer@example.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Customer Name *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Tracking Number *
            </label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
              placeholder="e.g., 1Z999AA10123456784"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Carrier *
            </label>
            <select
              value={formData.carrier}
              onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
              required
            >
              <option value="USPS">USPS</option>
              <option value="UPS">UPS</option>
              <option value="FedEx">FedEx</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: isSubmitting ? '#ccc' : '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send Shipping Notification'}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#fff9e6',
          borderRadius: '4px',
          borderLeft: '4px solid #DAA520'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#8B4513' }}>
            Instructions:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
            <li>Get order details from Airtable Orders table</li>
            <li>Enter the tracking number from your shipping carrier</li>
            <li>Customer will receive an email with tracking information</li>
            <li>Update the order status in Airtable after sending</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
