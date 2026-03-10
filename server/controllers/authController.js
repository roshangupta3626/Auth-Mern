import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';


export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: 'Missing Details' })
    }
    try {
        const existingUser = await UserModel.findOne({ email });
        if(existingUser) {
            return  res.json({ success: false, message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
        }); 
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
         });
         //sending email for verification
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to CodeWithRN App - Verify Your Email',
            text: `Hello ${newUser.name},\n\nThank you for registering. Your Account has Been Created with email id : ${email} Successfully By Roshan Gupta.\n\nBest Regards,\nCodeWithRN Team`
        };
        
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully to:', email);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
        }

        res.json({ success: true, message: 'Registration Successful' })


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.json({ success: false, message: 'Email and Password are Required' })
    }
    try {
        const user = await UserModel.findOne({ email });
        if(!user) {
            return res.json({ success: false, message: 'Invalid User/email' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.json({ success: false, message: 'Invalid Password' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
         });
        res.json({ success: true, message: 'Login Successful' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        res.json({ success: true, message: 'Logout Successful' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


//after register send verification otp to email and verify email with otp

export const sendVerifyOtp = async (req, res) => {
    try {
        const user = req.user; // ✅ get user from middleware

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account Already Verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your Account Verification OTP',
            text: `Hello ${user.name},\n\nYour OTP for account verification is: ${otp}. It is valid for 10 minutes.\n\nBest Regards,\nCodeWithRN Team`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Verification OTP Sent to Email' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//verify email with otp

export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = req.user; // ✅ from middleware

        if (!otp) {
            return res.json({ success: false, message: 'OTP is Required' });
        }

        if (user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpiryAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiryAt = 0;

        await user.save();

        res.json({ success: true, message: 'Email Verified Successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//check if user is authenticated or not

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true, message: 'User is Authenticated', user: req.user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


//send reset password otp to email

export const sendResetPasswordOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: 'Email is Required' });
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpiryAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your Password Reset OTP',
            text: `Hello ${user.name},\n\nYour OTP for password reset is: ${otp}. It is valid for 10 minutes.\n\nBest Regards,\nCodeWithRN Team`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Password Reset OTP Sent to Email' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
     }
};

//reset password using otp

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, otp, Password are required' });
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpiryAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiryAt = 0;

        await user.save();

        res.json({ success: true, message: 'Password Reset Successful' });
    }catch (error) {
        return res.json({ success: false, message: error.message });
     }
}

