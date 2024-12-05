import { NextRequest, NextResponse } from 'next/server';
import { SerialPort } from 'serialport';

const port = new SerialPort({ path: 'COM7', baudRate: 9600 });

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    if (port) {
      port.write(data.message + '\n', (err) => {
        if (err) {
          console.error('Error writing to port:', err.message);
          throw new Error('Failed to send data to Arduino');
        }
      });
    } else {
      throw new Error('Serial port not open');
    }

    return NextResponse.json(
      { message: `Data received: ${data}` },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
