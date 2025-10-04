import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import pool from '../config/database';

interface UserUpdateData {
  name?: string;
  email?: string;
  role?: string;
}

interface CreateUserData {
  name: string;
  email: string;
  role: 'employee' | 'manager';
  password?: string;
}

// Helper function to generate random password
function generateTempPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export class UserService {
  async getAllUsers(companyId: string) {
    const result = await pool.query(
      'SELECT id, company_id, name, email, role, is_active, created_at FROM users WHERE company_id = $1 ORDER BY created_at DESC',
      [companyId]
    );
    return result.rows;
  }

  async getUserById(userId: string, companyId: string) {
    const result = await pool.query(
      'SELECT id, company_id, name, email, role, is_active, created_at FROM users WHERE id = $1 AND company_id = $2',
      [userId, companyId]
    );
    return result.rows[0];
  }

  async createUser(data: CreateUserData, adminCompanyId: string) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Validate role - only allow employee or manager creation
      if (!['employee', 'manager'].includes(data.role)) {
        throw new Error('Can only create employee or manager users. Admin users are created during company signup.');
      }

      // Check if email already exists
      const emailCheck = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [data.email]
      );

      if (emailCheck.rows.length > 0) {
        throw new Error('Email already exists');
      }

      // Generate temporary password or use provided one
      const tempPassword = data.password || generateTempPassword();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Create user
      const userId = uuidv4();
      const result = await client.query(
        `INSERT INTO users (id, company_id, name, email, password_hash, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
         RETURNING id, company_id, name, email, role, is_active, created_at`,
        [userId, adminCompanyId, data.name, data.email, hashedPassword, data.role]
      );

      await client.query('COMMIT');

      // Send password setup email via notification service
      const axios = require('axios');
      const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5007';
      
      try {
        await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/send-password`, {
          email: data.email,
          name: data.name,
          tempPassword: tempPassword
        });
      } catch (error) {
        console.error('Failed to send password email:', error);
      }

      return {
        user: result.rows[0],
        tempPassword: tempPassword
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateUser(userId: string, companyId: string, data: UserUpdateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(data.name);
      paramCount++;
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramCount}`);
      values.push(data.email);
      paramCount++;
    }
    if (data.role !== undefined) {
      // Prevent changing to/from admin role
      if (data.role === 'admin') {
        throw new Error('Cannot change user role to admin. Only one admin per company is allowed.');
      }
      fields.push(`role = $${paramCount}`);
      values.push(data.role);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(userId, companyId);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND company_id = $${paramCount + 1}
      RETURNING id, company_id, name, email, role, is_active, created_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteUser(userId: string, companyId: string) {
    // Check if user is admin
    const userCheck = await pool.query(
      'SELECT role FROM users WHERE id = $1 AND company_id = $2',
      [userId, companyId]
    );

    if (userCheck.rows.length === 0) {
      throw new Error('User not found');
    }

    if (userCheck.rows[0].role === 'admin') {
      throw new Error('Cannot delete admin user');
    }

    const result = await pool.query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 AND company_id = $2 RETURNING id',
      [userId, companyId]
    );
    return result.rows[0];
  }

  async getUserManager(userId: string, companyId: string) {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role
       FROM users u
       INNER JOIN manager_relationships mr ON u.id = mr.manager_id
       WHERE mr.user_id = $1 AND mr.is_active = true AND u.company_id = $2
       LIMIT 1`,
      [userId, companyId]
    );
    return result.rows[0] || null;
  }

  async assignManager(userId: string, managerId: string, companyId: string) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Validate both users exist and belong to same company
      const usersCheck = await client.query(
        'SELECT id, role, name FROM users WHERE id = ANY($1) AND company_id = $2 AND is_active = true',
        [[userId, managerId], companyId]
      );

      if (usersCheck.rows.length !== 2) {
        throw new Error('Invalid user or manager');
      }

      // Prevent self-assignment
      if (userId === managerId) {
        throw new Error('User cannot be their own manager');
      }

      // Deactivate existing manager relationships for this user
      await client.query(
        'UPDATE manager_relationships SET is_active = false, updated_at = NOW() WHERE user_id = $1',
        [userId]
      );

      // Create new manager relationship
      const relationshipId = uuidv4();
      await client.query(
        `INSERT INTO manager_relationships (id, user_id, manager_id, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, true, NOW(), NOW())`,
        [relationshipId, userId, managerId]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Manager assigned successfully'
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserSubordinates(managerId: string, companyId: string) {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at
       FROM users u
       INNER JOIN manager_relationships mr ON u.id = mr.user_id
       WHERE mr.manager_id = $1 AND mr.is_active = true AND u.company_id = $2
       ORDER BY u.name`,
      [managerId, companyId]
    );
    return result.rows;
  }

  async sendPasswordSetupEmail(userId: string, companyId: string) {
    const axios = require('axios');
    const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5007';

    // Get user details
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1 AND company_id = $2',
      [userId, companyId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    
    // Generate new temporary password
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update user password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    // Send email via notification service
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/send-password`, {
        email: user.email,
        name: user.name,
        tempPassword: tempPassword
      });
    } catch (error) {
      console.error('Failed to send password email:', error);
    }

    return {
      success: true,
      tempPassword: tempPassword,
      message: 'Password setup email sent'
    };
  }
}
