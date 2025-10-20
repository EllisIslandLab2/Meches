import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, orderId, customerName, trackingNumber, carrier, items } = body;

    console.log('📧 Shipping notification request received:', {
      email,
      orderId,
      customerName,
      trackingNumber,
      carrier
    });

    // Validate required fields
    if (!email || !orderId) {
      return NextResponse.json(
        { error: 'Email and order ID are required' },
        { status: 400 }
      );
    }

    // Determine tracking URL based on carrier
    let trackingUrl = '';
    const carrierLower = (carrier || 'usps').toLowerCase();

    if (trackingNumber) {
      if (carrierLower.includes('usps')) {
        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
      } else if (carrierLower.includes('ups')) {
        trackingUrl = `https://www.ups.com/track?tracknum=${trackingNumber}`;
      } else if (carrierLower.includes('fedex')) {
        trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
      } else {
        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
      }
    }

    // Format items list if provided
    const itemsList = items?.map((item: any) => {
      return `  • ${item.name || item}`;
    }).join('\n') || '';

    // Create email HTML
    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f0;">
        <div style="background-color: #8B4513; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Your Order Has Shipped! 📦</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Meche's Creations</p>
        </div>

        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #333;">Hi ${customerName || 'there'},</p>

          <p style="font-size: 16px; color: #333;">
            Great news! Your handcrafted items are on their way to you!
          </p>

          <div style="background-color: #fff9e6; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #DAA520;">
            <h2 style="color: #8B4513; margin-top: 0; font-size: 20px;">Shipping Details</h2>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
            ${trackingNumber ? `<p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
            ${carrier ? `<p style="margin: 5px 0;"><strong>Carrier:</strong> ${carrier}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Ship Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          ${trackingNumber ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${trackingUrl}"
               style="display: inline-block; background-color: #8B4513; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
              Track Your Package →
            </a>
          </div>
          ` : ''}

          ${itemsList ? `
          <div style="background-color: #f5f5f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #8B4513; margin-top: 0; font-size: 18px;">Items in This Shipment:</h3>
            <pre style="font-family: Georgia, serif; white-space: pre-wrap; margin: 10px 0; line-height: 1.6;">${itemsList}</pre>
          </div>
          ` : ''}

          <div style="background-color: #fff9e6; padding: 15px; border-left: 4px solid #DAA520; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #8B4513; margin-top: 0; font-size: 18px;">Delivery Information</h3>
            <p style="margin: 5px 0;">• Estimated delivery: 3-7 business days</p>
            <p style="margin: 5px 0;">• You'll receive an email when it's delivered</p>
            <p style="margin: 5px 0;">• Track your package anytime using the link above</p>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            We hope you love your handcrafted items! If you have any questions or concerns, please don't hesitate to reach out.
          </p>

          <p style="color: #8B4513; font-style: italic; margin-top: 20px; font-size: 16px;">
            Thank you for supporting handmade!<br>
            <strong>Meche's Creations</strong>
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            <p style="margin: 5px 0;">Meche's Creations - Handcrafted with Love</p>
            <p style="margin: 5px 0;">www.mechescreations.com</p>
          </div>
        </div>
      </div>
    `;

    const emailText = `
Your Order Has Shipped!

Hi ${customerName || 'there'},

Great news! Your handcrafted items are on their way to you!

Shipping Details:
Order ID: ${orderId}
${trackingNumber ? `Tracking Number: ${trackingNumber}\n` : ''}
${carrier ? `Carrier: ${carrier}\n` : ''}
Ship Date: ${new Date().toLocaleDateString()}

${trackingNumber ? `Track your package: ${trackingUrl}\n` : ''}

${itemsList ? `Items in This Shipment:\n${itemsList}\n` : ''}

Delivery Information:
• Estimated delivery: 3-7 business days
• You'll receive an email when it's delivered
• Track your package anytime using the link above

We hope you love your handcrafted items! If you have any questions or concerns, please don't hesitate to reach out.

Thank you for supporting handmade!
Meche's Creations

---
Meche's Creations - Handcrafted with Love
www.mechescreations.com
    `;

    // Send email via Resend
    const { data, error: resendError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'orders@mariacrafts.com',
      to: email,
      subject: `Your Order Has Shipped - #${orderId}`,
      html: emailHtml,
      text: emailText,
    });

    if (resendError) {
      console.error('❌ Resend error:', resendError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    console.log('✅ Shipping notification email sent successfully:', data);

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });

  } catch (error) {
    console.error('Error sending shipping notification email:', error);
    return NextResponse.json(
      { error: 'Failed to send shipping notification' },
      { status: 500 }
    );
  }
}
