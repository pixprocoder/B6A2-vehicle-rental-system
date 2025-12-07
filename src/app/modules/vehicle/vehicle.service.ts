import { pool } from "../../../config/db";

const addVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
      INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *
      `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getVehicles = async () => {
  const result = await pool.query(
    `
       SELECT * FROM vehicles
        `
  );
  return result;
};

const getSingleVehicle = async (paramsId: string) => {
  console.log(paramsId);
  const result = await pool.query(
    `
       SELECT * FROM vehicles WHERE id = $1 
        `,
    [paramsId]
  );
  return result;
};

const updateVehicle = async (
  vehicleId: string,
  updateData: Record<string, unknown>
) => {
  if (updateData?.registration_number) {
    const registrationCheck = await pool.query(
      `SELECT id FROM vehicles WHERE registration_number = $1 AND id != $2`,
      [updateData?.registration_number, vehicleId]
    );

    if (registrationCheck.rows.length > 0) {
      throw new Error("Registration number already exists");
    }
  }

  const query = `
    UPDATE vehicles 
    SET 
      vehicle_name = COALESCE($1, vehicle_name),
      type = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status)
    WHERE id = $6
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
  `;

  const values = [
    updateData?.vehicle_name || null,
    updateData?.type || null,
    updateData?.registration_number || null,
    updateData?.daily_rent_price || null,
    updateData?.availability_status || null,
    vehicleId,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const vehicleServices = {
  addVehicle,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
};
