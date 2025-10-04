import pool from '../config/database';

interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  department?: string;
}

export class UserService {
  async getAllUsers(companyId: number) {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, department, phone, is_active, created_at FROM users WHERE company_id = $1',
      [companyId]
    );
    return result.rows;
  }

  async getUserById(userId: number, companyId: number) {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, department, phone, is_active, created_at FROM users WHERE id = $1 AND company_id = $2',
      [userId, companyId]
    );
    return result.rows[0];
  }

  async updateUser(userId: number, companyId: number, data: UserUpdateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.first_name !== undefined) {
      fields.push(`first_name = $${paramCount}`);
      values.push(data.first_name);
      paramCount++;
    }
    if (data.last_name !== undefined) {
      fields.push(`last_name = $${paramCount}`);
      values.push(data.last_name);
      paramCount++;
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramCount}`);
      values.push(data.phone);
      paramCount++;
    }
    if (data.department !== undefined) {
      fields.push(`department = $${paramCount}`);
      values.push(data.department);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId, companyId);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND company_id = $${paramCount + 1}
      RETURNING id, email, first_name, last_name, role, department, phone, is_active, created_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteUser(userId: number, companyId: number) {
    const result = await pool.query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND company_id = $2 RETURNING id',
      [userId, companyId]
    );
    return result.rows[0];
  }

  async getUserManagers(userId: number, companyId: number) {
    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.department
       FROM users u
       INNER JOIN manager_relationships mr ON u.id = mr.manager_id
       WHERE mr.user_id = $1 AND mr.is_active = true AND u.company_id = $2`,
      [userId, companyId]
    );
    return result.rows;
  }

  async getUserSubordinates(managerId: number, companyId: number) {
    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.department
       FROM users u
       INNER JOIN manager_relationships mr ON u.id = mr.user_id
       WHERE mr.manager_id = $1 AND mr.is_active = true AND u.company_id = $2`,
      [managerId, companyId]
    );
    return result.rows;
  }

  async assignManager(userId: number, managerId: number, companyId: number) {
    // First verify both users exist and belong to same company
    const usersCheck = await pool.query(
      'SELECT id FROM users WHERE id IN ($1, $2) AND company_id = $3',
      [userId, managerId, companyId]
    );

    if (usersCheck.rows.length !== 2) {
      throw new Error('Invalid user or manager');
    }

    // Deactivate existing manager relationships
    await pool.query(
      'UPDATE manager_relationships SET is_active = false WHERE user_id = $1',
      [userId]
    );

    // Create new manager relationship
    const result = await pool.query(
      `INSERT INTO manager_relationships (user_id, manager_id, is_active)
       VALUES ($1, $2, true)
       RETURNING id, user_id, manager_id, created_at`,
      [userId, managerId]
    );

    return result.rows[0];
  }

  async removeManager(userId: number, managerId: number) {
    const result = await pool.query(
      'UPDATE manager_relationships SET is_active = false WHERE user_id = $1 AND manager_id = $2 RETURNING id',
      [userId, managerId]
    );
    return result.rows[0];
  }

  async getUsersByRole(companyId: number, role: string) {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, department FROM users WHERE company_id = $1 AND role = $2 AND is_active = true',
      [companyId, role]
    );
    return result.rows;
  }

  async getUsersByDepartment(companyId: number, department: string) {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, department FROM users WHERE company_id = $1 AND department = $2 AND is_active = true',
      [companyId, department]
    );
    return result.rows;
  }
}
