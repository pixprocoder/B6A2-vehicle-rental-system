import bcrypt from "bcryptjs";
import { pool } from "../../../config/db";
import config from "../../../config";
import jwt from "jsonwebtoken";

// Create user
const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `
                   INSERT INTO users(name, email,password,phone, role) VALUES($1, $2, $3, $4, $5) RETURNING * 
                   
                    `,
    [name, email, hashedPassword, phone, role]
  );

  return result;
};

// login
const loginUser = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const user = result.rows[0];

  const isPasswordMatch = await bcrypt.compare(
    password as string,
    user.password
  );

  if (!isPasswordMatch) {
    const error: any = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwt_secret as string,
    {
      expiresIn: "7d",
    }
  );

  return { token, user };
};

export const authServices = {
  createUser,
  loginUser,
};
