const db = require('./db');

async function addTestRequest() {
  try {
    const sql = `
      INSERT INTO emergency_requests 
        (first_name, last_name, phone_number, location, emergency_type, selected_tags, additional_details) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      'John',
      'Doe',
      '09123456789',
      'General Santos City',
      'Medical',
      'Urgent, First Aid',
      'Test emergency request from Node.js'
    ];

    const [result] = await db.query(sql, values);
    console.log('Row inserted successfully with ID:', result.insertId);

    // Fetch all rows to confirm it shows up
    const [rows] = await db.query('SELECT * FROM emergency_requests');
    console.log('\n--- Updated Emergency Requests ---');
    console.table(rows);

  } catch (error) {
    console.error('Error inserting data:', error.message);
  }
}

addTestRequest();