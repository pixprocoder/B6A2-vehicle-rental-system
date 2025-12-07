import { pool } from "../../../config/db";

const getUsers = async () => {
  const result = await pool.query(`
      SELECT * FROM users 
    `);
  return result;
};

// update user
const updateUser = async (
  paramsUserId: string,
  currentUser: Record<string, undefined>,
  updateData: Record<string, unknown>
) => {
  if (updateData?.name || updateData?.email || updateData?.phone) {
    await pool.query(
      `UPDATE users 
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone)
     WHERE id = $4`,
      [updateData?.name, updateData?.email, updateData?.phone, paramsUserId]
    );
  }

  if (updateData?.role) {
    if (currentUser?.role !== "admin") {
      throw new Error("Only admins can change user roles");
    }
    await pool.query(`UPDATE users SET role = $1  WHERE id = $2`, [
      updateData?.role,
      paramsUserId,
    ]);
  }

  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [paramsUserId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

// delete user
const deleteUser = async (paramsUserId: string) => {
  const checkActiveBooking = await pool.query(
    `
    SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'
    `,
    [paramsUserId]
  );

  if (checkActiveBooking.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(`DELETE FROM users WHERE id = $1 `, [
    paramsUserId,
  ]);

  return result.rows[0];
};

export const userServices = {
  getUsers,
  updateUser,
  deleteUser,
};
