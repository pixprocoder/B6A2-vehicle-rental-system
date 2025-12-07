import { pool } from "../../../config/db";

const createBooking = async (currentUser: any, bookingData: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
    bookingData;

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

  const conflictCheck = await pool.query(
    `SELECT id FROM bookings 
     WHERE vehicle_id = $1 
     AND status = 'active'
     AND (
       (rent_start_date <= $2 AND rent_end_date >= $2) OR
       (rent_start_date <= $3 AND rent_end_date >= $3) OR
       (rent_start_date >= $2 AND rent_end_date <= $3)
     )`,
    [vehicle_id, rent_start_date, rent_end_date]
  );

  if (conflictCheck.rows.length > 0) {
    throw new Error("Vehicle is already booked for the selected dates");
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

// get bookings
const getBookings = async (currentUser: any) => {
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
  return result.rows;
};

// update booking
const updateBooking = async (
  bookingId: string,
  currentUser: any,
  { status }: { status: string }
) => {
  if (!status) {
    throw new Error("Status is required");
  }

  if (!["cancelled", "returned"].includes(status)) {
    throw new Error("Invalid status. Only 'cancelled' or 'returned' allowed");
  }

  // Get booking details
  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingCheck.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingCheck.rows[0];

  // Check if booking is already completed
  if (booking.status === "cancelled" || booking.status === "returned") {
    throw new Error(`Booking is already ${booking.status}`);
  }

  // role base actions logic
  if (status === "cancelled") {
    if (
      currentUser.role === "customer" &&
      currentUser.id !== booking.customer_id
    ) {
      throw new Error("You can only cancel your own bookings");
    }
  }

  if (status === "returned") {
    if (currentUser.role !== "admin") {
      throw new Error("Only admins can mark bookings as returned");
    }
  }

  // Update booking status
  const result = await pool.query(
    `UPDATE bookings 
       SET status = $1
       WHERE id = $2 
       RETURNING *`,
    [status, bookingId]
  );

  // update vehicle availability
  if (status === "returned") {
    await pool.query(
      `UPDATE vehicles 
         SET availability_status = 'available' 
         WHERE id = $1`,
      [booking.vehicle_id]
    );

    return {
      ...result.rows[0],
      vehicle: {
        availability_status: "available",
      },
    };
  }

  // If status is 'cancelled', also update vehicle availability to 'available'
  if (status === "cancelled") {
    await pool.query(
      `UPDATE vehicles 
         SET availability_status = 'available' 
         WHERE id = $1`,
      [booking.vehicle_id]
    );
  }

  return result.rows[0];
};

export const bookingServices = {
  createBooking,
  getBookings,
  updateBooking,
};
