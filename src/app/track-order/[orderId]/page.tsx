'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  orderItems: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: string;
  orderDate: string;
  status?: string;
  trackingNumber?: string;
  carrier?: string;
}

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        const response = await fetch(`/api/get-order/${orderId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Order not found. Please check your order ID.');
          } else {
            setError('Failed to load order details. Please try again later.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setOrder(data.order);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const getTrackingUrl = (trackingNumber: string, carrier: string = 'usps') => {
    const carrierLower = carrier.toLowerCase();
    if (carrierLower.includes('usps')) {
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
    } else if (carrierLower.includes('ups')) {
      return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    } else if (carrierLower.includes('fedex')) {
      return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
    }
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'processing':
        return '#4169E1';
      case 'shipped':
        return '#28A745';
      case 'delivered':
        return '#28A745';
      default:
        return '#8B7355';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '🔨';
      case 'shipped':
        return '📦';
      case 'delivered':
        return '✅';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f7f4',
        fontFamily: 'Georgia, serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
          <h2 style={{ color: '#8B7355' }}>Loading order details...</h2>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f7f4',
        fontFamily: 'Georgia, serif',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
          <h1 style={{ color: '#8B7355', marginBottom: '20px' }}>Order Not Found</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>{error}</p>
          <Link href="/" style={{
            display: 'inline-block',
            backgroundColor: '#8B7355',
            color: 'white',
            padding: '12px 30px',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const items = order.orderItems ? order.orderItems.split('\n') : [];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9f7f4',
      fontFamily: 'Georgia, serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        paddingTop: '40px'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#8B7355',
          color: 'white',
          padding: '30px',
          borderRadius: '8px 8px 0 0',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '32px' }}>Order Tracking</h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Order #{order.orderId}</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {/* Status Section */}
          <div style={{
            backgroundColor: '#f9f7f4',
            padding: '25px',
            borderRadius: '8px',
            marginBottom: '30px',
            textAlign: 'center',
            borderLeft: `5px solid ${getStatusColor(order.status || 'Pending')}`
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>
              {getStatusIcon(order.status || 'Pending')}
            </div>
            <h2 style={{
              color: getStatusColor(order.status || 'Pending'),
              margin: '0 0 10px 0',
              fontSize: '24px'
            }}>
              {order.status || 'Pending'}
            </h2>
            <p style={{ color: '#666', margin: 0 }}>
              Order placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <div style={{
              backgroundColor: '#fff9e6',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px',
              borderLeft: '4px solid #DAA520'
            }}>
              <h3 style={{ color: '#8B7355', marginTop: 0 }}>Tracking Information</h3>
              <p style={{ margin: '10px 0' }}>
                <strong>Tracking Number:</strong> {order.trackingNumber}
              </p>
              {order.carrier && (
                <p style={{ margin: '10px 0' }}>
                  <strong>Carrier:</strong> {order.carrier}
                </p>
              )}
              <a
                href={getTrackingUrl(order.trackingNumber, order.carrier || 'usps')}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#8B7355',
                  color: 'white',
                  padding: '12px 25px',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  marginTop: '15px',
                  fontWeight: 'bold'
                }}
              >
                Track Package →
              </a>
            </div>
          )}

          {/* Order Items */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#8B7355', borderBottom: '2px solid #e0d5c7', paddingBottom: '10px' }}>
              Order Items
            </h3>
            <div style={{
              backgroundColor: '#f9f7f4',
              padding: '20px',
              borderRadius: '5px',
              marginTop: '15px'
            }}>
              {items.map((item, index) => (
                <div key={index} style={{
                  padding: '10px 0',
                  borderBottom: index < items.length - 1 ? '1px solid #e0d5c7' : 'none'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#8B7355', borderBottom: '2px solid #e0d5c7', paddingBottom: '10px' }}>
              Order Summary
            </h3>
            <div style={{
              backgroundColor: '#f9f7f4',
              padding: '20px',
              borderRadius: '5px',
              marginTop: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal:</span>
                <strong>${order.subtotal.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Shipping:</span>
                <strong>${order.shipping.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Tax:</span>
                <strong>${order.tax.toFixed(2)}</strong>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#28a745' }}>
                  <span>Discount:</span>
                  <strong>-${order.discount.toFixed(2)}</strong>
                </div>
              )}
              <hr style={{ border: 'none', borderTop: '2px solid #8B7355', margin: '15px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                <strong>Total:</strong>
                <strong style={{ color: '#8B7355' }}>${order.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#8B7355', borderBottom: '2px solid #e0d5c7', paddingBottom: '10px' }}>
                Shipping Address
              </h3>
              <div style={{
                backgroundColor: '#f9f7f4',
                padding: '20px',
                borderRadius: '5px',
                marginTop: '15px',
                whiteSpace: 'pre-wrap'
              }}>
                <strong>{order.customerName}</strong><br />
                {order.address}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '2px solid #e0d5c7' }}>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              Questions about your order?
            </p>
            <Link href="/contact" style={{
              color: '#8B7355',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              Contact Us →
            </Link>
          </div>
        </div>

        {/* Return to Home */}
        <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '40px' }}>
          <Link href="/" style={{
            display: 'inline-block',
            backgroundColor: '#8B7355',
            color: 'white',
            padding: '12px 30px',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
