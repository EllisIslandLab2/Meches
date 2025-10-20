import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, orderId, customerName, items, totals } = body;

    console.log('📧 Order confirmation request received:', {
      email,
      orderId,
      customerName,
      itemCount: items?.length || 0,
      resendConfigured: !!process.env.RESEND_API_KEY,
      emailFrom: process.env.EMAIL_FROM
    });

    // Validate required fields
    if (!email || !orderId) {
      console.error('❌ Missing required fields: email or orderId');
      return NextResponse.json(
        { error: 'Email and order ID are required' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Format items for email
    const itemsList = items?.map((item: any) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return `  • ${item.name} (${item.variant}) - Qty: ${quantity} - $${price.toFixed(2)} each`;
    }).join('\n') || 'No items';

    // Create email HTML
    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f0;">
        <div style="background-color: #8B4513; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Meche's Creations</p>
        </div>

        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #333;">Hi ${customerName || 'there'},</p>

          <p style="font-size: 16px; color: #333;">
            Thank you for your order! We're excited to handcraft your items with care and love.
          </p>

          <div style="background-color: #fff9e6; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #DAA520;">
            <h2 style="color: #8B4513; margin-top: 0; font-size: 20px;">Order Details</h2>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <h3 style="color: #8B4513; font-size: 18px;">Items Ordered:</h3>
          <pre style="font-family: Georgia, serif; white-space: pre-wrap; background-color: #f5f5f0; padding: 15px; border-radius: 5px; line-height: 1.6;">${itemsList}</pre>

          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f0; border-radius: 5px;">
            <p style="margin: 5px 0; display: flex; justify-content: space-between;">
              <span>Subtotal:</span>
              <strong>$${(totals?.subtotal || 0).toFixed(2)}</strong>
            </p>
            <p style="margin: 5px 0; display: flex; justify-content: space-between;">
              <span>Shipping:</span>
              <strong>$${(totals?.shipping || 0).toFixed(2)}</strong>
            </p>
            <p style="margin: 5px 0; display: flex; justify-content: space-between;">
              <span>Tax:</span>
              <strong>$${(totals?.estimatedTax || 0).toFixed(2)}</strong>
            </p>
            ${totals?.discount ? `
            <p style="margin: 5px 0; display: flex; justify-content: space-between;">
              <span>Discount:</span>
              <strong style="color: #28a745;">-$${totals.discount.toFixed(2)}</strong>
            </p>
            ` : ''}
            <hr style="border: none; border-top: 2px solid #8B4513; margin: 10px 0;">
            <p style="margin: 5px 0; display: flex; justify-content: space-between; font-size: 18px;">
              <span><strong>Total:</strong></span>
              <strong style="color: #8B4513;">$${(totals?.total || 0).toFixed(2)}</strong>
            </p>
          </div>

          <div style="background-color: #fff9e6; padding: 15px; border-left: 4px solid #DAA520; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #8B4513; margin-top: 0; font-size: 18px;">What's Next?</h3>
            <p style="margin: 5px 0;">1. We'll start crafting your items with care</p>
            <p style="margin: 5px 0;">2. You'll receive a shipping notification with tracking info</p>
            <p style="margin: 5px 0;">3. Track your order anytime at: <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mechescreations.com'}/track-order/${orderId}" style="color: #8B4513; text-decoration: none; font-weight: bold;">Track Order →</a></p>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Questions about your order? Reply to this email and we'll be happy to help!
          </p>

          <p style="color: #8B4513; font-style: italic; margin-top: 20px; font-size: 16px;">
            With love,<br>
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
Thank You for Your Order!

Hi ${customerName || 'there'},

Thank you for your order! We're excited to handcraft your items with care and love.

Order Details:
Order ID: ${orderId}
Order Date: ${new Date().toLocaleDateString()}

Items Ordered:
${itemsList}

Order Summary:
Subtotal: $${(totals?.subtotal || 0).toFixed(2)}
Shipping: $${(totals?.shipping || 0).toFixed(2)}
Tax: $${(totals?.estimatedTax || 0).toFixed(2)}
${totals?.discount ? `Discount: -$${totals.discount.toFixed(2)}\n` : ''}
Total: $${(totals?.total || 0).toFixed(2)}

What's Next?
1. We'll start crafting your items with care
2. You'll receive a shipping notification with tracking info
3. Track your order anytime at: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mechescreations.com'}/track-order/${orderId}

Questions about your order? Reply to this email and we'll be happy to help!

With love,
Meche's Creations

---
Meche's Creations - Handcrafted with Love
www.mechescreations.com
    `;

    // Send email via Resend
    const { data, error: resendError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'orders@mariacrafts.com',
      to: email,
      subject: `Order Confirmation - #${orderId}`,
      html: emailHtml,
      text: emailText,
    });

    if (resendError) {
      console.error('Resend error:', resendError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    console.log('Order confirmation email sent:', data);

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });

  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
