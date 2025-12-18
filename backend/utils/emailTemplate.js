const styles = `
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background-color: #f6f9fc; 
      margin: 0; 
      padding: 0; 
      line-height: 1.6; 
      color: #333; 
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: #ffffff; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); 
    }
    .header { 
      background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); 
      padding: 30px; 
      text-align: center; 
      color: white; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: 700; 
      letter-spacing: 1px; 
    }
    .content { 
      padding: 40px 30px; 
      text-align: center; 
    }
    .content p { 
      font-size: 16px; 
      color: #555; 
      margin-bottom: 25px; 
    }
    .otp-box { 
      background: #f0f4f8; 
      border: 2px dashed #007bff; 
      color: #007bff; 
      font-size: 36px; 
      font-weight: 800; 
      padding: 15px 30px; 
      border-radius: 8px; 
      display: inline-block; 
      letter-spacing: 5px; 
      margin: 20px 0; 
    }
    .otp-box.delivery { 
      border-color: #28a745; 
      color: #28a745; 
      background: #e8f5e9; 
    }
    .btn { 
      display: inline-block; 
      background-color: #007bff; 
      color: white; 
      padding: 12px 30px; 
      border-radius: 50px; 
      text-decoration: none; 
      font-weight: 600; 
      margin-top: 20px; 
      transition: background-color 0.3s; 
    }
    .btn:hover { 
      background-color: #0056b3; 
    }
    .footer { 
      background-color: #f9f9f9; 
      padding: 20px; 
      text-align: center; 
      font-size: 13px; 
      color: #888; 
      border-top: 1px solid #eaeaea; 
    }
    .footer a { 
      color: #007bff; 
      text-decoration: none; 
      margin: 0 5px; 
    }
`;


// Reset Password Template
export const getResetPasswordTemplate = (fullName, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Yummigo</h1>
        </div>
        <div class="content">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            <p>Hello ${fullName},</p>
            <p>We received a request to reset your password. Use the code below to complete the process. This code expires in 5 minutes.</p>
            <div class="otp-box">${otp}</div>
            <p style="font-size: 14px; color: #777;">If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Yummigo. All rights reserved.</p>
            <p><a href="#">Help Center</a> | <a href="#">Privacy Policy</a></p>
        </div>
    </div>
</body>
</html>
    `;
};


// Delivery Confirmation OTP Template
export const getDeliveryConfirmationOTP = (fullName, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        <div class="header" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
            <h1>Yummigo Delivery</h1>
        </div>
        <div class="content">
            <h2 style="color: #333; margin-top: 0;">Order Arrival!</h2>
            <p>Hey ${fullName}, your delicious food has arrived at your doorstep!</p>
            <p>Please share the One-Time Password (OTP) below with your delivery partner to verify and receive your order.</p>
            <div class="otp-box delivery">${otp}</div>
            <p style="font-size: 14px; color: #777;">Enjoy your meal! 🍔🍕</p>
        </div>
        <div class="footer">
             <p>Copyright &copy; ${new Date().getFullYear()} Yummigo. All rights reserved.</p>
             <p>Need help with your order? <a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
    `;
};
