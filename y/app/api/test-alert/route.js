import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message = 'Test alert', severity = 8 } = await request.json();

    const alertPayload = {
      id: Date.now(),
      type: 'test',
      severity: parseInt(severity),
      title: `🧪 Test Alert`,
      description: message,
      source: 'Manual Test',
      timestamp: new Date().toISOString()
    };

    if (global.io) {
      console.log('Emitting test alert:', alertPayload);
      global.io.emit('global-alert', alertPayload);
      
      return NextResponse.json({
        success: true,
        message: 'Test alert sent',
        alert: alertPayload
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Socket not initialized'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error sending test alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send test alert' },
      { status: 500 }
    );
  }
}