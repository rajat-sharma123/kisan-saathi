import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kisan_saathi_innovix_jwt_secret_2026';

export async function register(req, res, next) {
  try {
    const { name, phone, password, preferredLanguage, state, district, village, farmSize, soilType, primaryCrop } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required.' });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this mobile number already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password || 'kisan123', 10);
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      preferredLanguage: preferredLanguage || 'hi',
      state: state || 'Bihar',
      district: district || 'Bhagalpur',
      village: village || 'Kahalgaon',
      farmSize: farmSize || '3.5',
      soilType: soilType || 'Alluvial Loam',
      primaryCrop: primaryCrop || 'Rice & Wheat'
    });

    const token = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        state: user.state,
        district: user.district,
        village: user.village,
        farmSize: user.farmSize,
        soilType: user.soilType,
        primaryCrop: user.primaryCrop
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { phone, password } = req.body;

    // Check demo login fast-path
    if (phone === '9876543210') {
      const token = jwt.sign({ id: 'demo_user', phone }, JWT_SECRET, { expiresIn: '30d' });
      return res.json({
        success: true,
        token,
        user: {
          id: 'demo_user',
          name: 'Ramesh Kumar Sharma',
          phone: '9876543210',
          preferredLanguage: 'hi',
          state: 'Bihar',
          district: 'Bhagalpur',
          village: 'Kahalgaon',
          farmSize: '3.5',
          soilType: 'Alluvial Loam',
          primaryCrop: 'Rice & Wheat'
        }
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid phone or password.' });
    }

    if (password) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ success: false, message: 'Invalid phone or password.' });
      }
    }

    const token = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        state: user.state,
        district: user.district,
        village: user.village,
        farmSize: user.farmSize,
        soilType: user.soilType,
        primaryCrop: user.primaryCrop
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    if (req.userId === 'demo_user') {
      return res.json({
        success: true,
        user: {
          id: 'demo_user',
          name: 'Ramesh Kumar Sharma',
          phone: '9876543210',
          preferredLanguage: 'hi',
          state: 'Bihar',
          district: 'Bhagalpur',
          village: 'Kahalgaon',
          farmSize: '3.5',
          soilType: 'Alluvial Loam',
          primaryCrop: 'Rice & Wheat'
        }
      });
    }

    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updates = req.body;
    if (req.userId !== 'demo_user') {
      await User.findByIdAndUpdate(req.userId, updates);
    }
    res.json({ success: true, message: 'Profile updated successfully.', updates });
  } catch (err) {
    next(err);
  }
}
