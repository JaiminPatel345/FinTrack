import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken, verifyToken } from '../utils/jwt.util';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/email.util';

interface SignupData {
  name: string;
  email: string;
  password: string;
  country: string;
  currency: string;
  companyName?: string;
}

interface SigninData {
  email: string;
  password: string;
}

export const authService = {
  async signup(data: SignupData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check if email already exists
      const emailCheck = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [data.email]
      );

      if (emailCheck.rows.length > 0) {
        throw new Error('Email already exists');
      }

      // Create company
      const companyId = uuidv4();
      const companyName = data.companyName || `${data.name}'s Company`;
      
      await client.query(
        `INSERT INTO companies (id, name, country, currency_code, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [companyId, companyName, data.country, data.currency]
      );

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create admin user
      const userId = uuidv4();
      await client.query(
        `INSERT INTO users (id, company_id, name, email, password_hash, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [userId, companyId, data.name, data.email, hashedPassword, 'admin', true]
      );

      await client.query('COMMIT');

      // Send welcome email (non-blocking)
      sendWelcomeEmail(data.email, data.name).catch(err => 
        console.error('Failed to send welcome email:', err)
      );

      // Generate JWT token
      const token = generateToken({
        userId,
        email: data.email,
        role: 'admin',
        companyId,
      });

      return {
        token,
        user: {
          id: userId,
          name: data.name,
          email: data.email,
          role: 'admin',
          companyId,
          companyName,
          currency: data.currency,
        },
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async signin(data: SigninData) {
    const result = await pool.query(
      `SELECT u.id, u.company_id, u.name, u.email, u.password_hash, u.role, u.is_active,
              c.name as company_name, c.currency_code
       FROM users u
       JOIN companies c ON u.company_id = c.id
       WHERE u.email = $1`,
      [data.email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = result.rows[0];

    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isValidPassword = await comparePassword(data.password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.company_id,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.company_id,
        companyName: user.company_name,
        currency: user.currency_code,
      },
    };
  },

  async forgotPassword(email: string) {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      // Don't reveal if email exists or not
      return;
    }

    const user = result.rows[0];
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      `UPDATE users 
       SET reset_token = $1, reset_token_expiry = $2, updated_at = NOW()
       WHERE id = $3`,
      [resetToken, resetTokenExpiry, user.id]
    );

    // Send reset email
    await sendPasswordResetEmail(user.email, user.name, resetToken);
  },

  async resetPassword(token: string, newPassword: string) {
    const result = await pool.query(
      `SELECT id, reset_token_expiry FROM users 
       WHERE reset_token = $1 AND is_active = true`,
      [token]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid or expired reset token');
    }

    const user = result.rows[0];

    if (new Date() > new Date(user.reset_token_expiry)) {
      throw new Error('Reset token has expired');
    }

    const hashedPassword = await hashPassword(newPassword);

    await pool.query(
      `UPDATE users 
       SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL, updated_at = NOW()
       WHERE id = $2`,
      [hashedPassword, user.id]
    );
  },

  async verifyToken(token: string) {
    try {
      const payload = verifyToken(token);
      return {
        valid: true,
        payload,
      };
    } catch (error) {
      return {
        valid: false,
      };
    }
  },
};
