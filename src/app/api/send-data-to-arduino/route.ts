import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse JSON data received from the frontend
    const data = await request.json();

    // Arduino server URL (replace with your Arduino's IP address)
    const arduinoUrl = `http://${process.env.ARDUINO_IP}:${process.env.ARDUINO_PORT}`;

    // Send data to the Arduino using Axios
    const response = await axios.post(arduinoUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Respond to the frontend with the Arduino's response
    return NextResponse.json({ message: response.data });
  } catch (error) {
    console.error('Error communicating with Arduino:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
