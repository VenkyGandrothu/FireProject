import prisma from '../config/prisma.js';

// Controller → Register QR codes (single or multiple)
export const registerQRCodes = async (req, res) => {
  try {
    const qrCodes = req.body;

    // Check if it's a single QR code or an array
    if (Array.isArray(qrCodes)) {
      // Multiple QR codes
      if (qrCodes.length === 0) {
        return res.status(400).json({ success: false, message: "QR codes array is required" });
      }

      const createdQRCodes = await prisma.qRCode.createMany({
        data: qrCodes.map(qr => ({
          floor_id: Number(qr.floor_id),
          qr_code_number: String(qr.qr_code_number),
          installed_location: qr.installed_location || null,
        })),
      });

      res.status(201).json({ success: true, count: createdQRCodes.count });
    } else {
      // Single QR code
      const { floor_id, qr_code_number, installed_location } = qrCodes;

      const qrCode = await prisma.qRCode.create({
        data: {
          floor_id: Number(floor_id),
          qr_code_number: String(qr_code_number),
          installed_location: installed_location || null,
        },
      });

      res.status(201).json({ success: true, qrCode });
    }
  } catch (err) {
    console.error("registerQRCodes:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get all QR codes
export const getQRCodes = async (req, res) => {
  try {
    const qrCodes = await prisma.qRCode.findMany({
      orderBy: {
        qr_code_id: 'desc',
      },
    });

    res.json({ success: true, qrCodes });
  } catch (err) {
    console.error("getQRCodes:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get QR codes by floor
export const getQRCodesByFloor = async (req, res) => {
  try {
    const { floor_id } = req.params;

    const qrCodes = await prisma.qRCode.findMany({
      where: {
        floor_id: Number(floor_id),
      },
      orderBy: {
        qr_code_id: 'desc',
      },
    });

    res.json({ success: true, qrCodes });
  } catch (err) {
    console.error("getQRCodesByFloor:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};