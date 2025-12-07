import { pool } from "../../../config/db";

const createBooking = async (currentUser: any, bookingData: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
    bookingData;

  console.log(bookingData);

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error("All fields are required");
  }

  if (new Date(rent_end_date) <= new Date(rent_start_date)) {
    throw new Error("End date must be after start date");
  }

  // Check if vehicle exists and is available
  const vehicleCheck = await pool.query(
    `SELECT id, vehicle_name, daily_rent_price, availability_status 
       FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleCheck.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleCheck.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  const customerCheck = await pool.query(
    `SELECT id FROM users WHERE id = $1 AND role = 'customer'`,
    [customer_id]
  );

  if (customerCheck.rows.length === 0) {
    throw new Error("Customer not found");
  }

  if (currentUser.role === "customer" && currentUser.id !== customer_id) {
    throw new Error("You can only create bookings for yourself");
  }

  const startDate: any = new Date(rent_start_date);
  const endDate: any = new Date(rent_end_date);
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const total_price = days * vehicle.daily_rent_price;

  // Create booking
  const bookingResult = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // Update vehicle status to 'booked'
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...bookingResult.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getBookings = async (currentUser: any) => {
  console.log(currentUser);
  await pool.query(`
        UPDATE bookings 
        SET status = 'returned' 
        WHERE status = 'active' 
        AND rent_end_date < CURRENT_DATE
      `);

  let query: string;
  let values: any[];

  if (currentUser.role === "admin") {
    query = `
          SELECT 
            b.*,
            json_build_object(
              'name', u.name,
              'email', u.email
            ) as customer,
            json_build_object(
              'vehicle_name', v.vehicle_name,
              'registration_number', v.registration_number
            ) as vehicle
          FROM bookings b
          JOIN users u ON b.customer_id = u.id
          JOIN vehicles v ON b.vehicle_id = v.id
        `;
    values = [];
  } else {
    query = `
          SELECT 
            b.*,
            json_build_object(
              'name', u.name,
              'email', u.email
            ) as customer,
            json_build_object(
              'vehicle_name', v.vehicle_name,
              'registration_number', v.registration_number
            ) as vehicle
          FROM bookings b
          JOIN users u ON b.customer_id = u.id
          JOIN vehicles v ON b.vehicle_id = v.id
          WHERE b.customer_id = $1
        `;
    values = [currentUser.id];
  }

  const result = await pool.query(query, values);
  //   console.log(result);
  return result.rows;
};

export const bookingServices = {
  createBooking,
  getBookings,
};
