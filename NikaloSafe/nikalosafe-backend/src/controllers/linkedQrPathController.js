import prisma from '../config/prisma.js';

// Controller → Link QR code to paths (alias for createQrPathLinks)
export const linkQrToPaths = async (req, res) => {
  try {
    const { qr_code_id, path_ids } = req.body;

    if (!qr_code_id || !Array.isArray(path_ids) || path_ids.length === 0) {
      return res.status(400).json({ success: false, message: "qr_code_id and path_ids array are required" });
    }

    // Create multiple links
    const links = await prisma.linkedQrPath.createMany({
      data: path_ids.map(path_id => ({
        qr_code_id: Number(qr_code_id),
        path_id: Number(path_id),
      })),
      skipDuplicates: true, // Skip if link already exists
    });

    res.status(201).json({ success: true, count: links.count });
  } catch (err) {
    console.error("linkQrToPaths:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get paths for a QR code
export const getPathsForQr = async (req, res) => {
  try {
    const { qr_code_id } = req.params;

    const paths = await prisma.linkedQrPath.findMany({
      where: {
        qr_code_id: Number(qr_code_id),
      },
      include: {
        exitPath: true,
      },
      orderBy: {
        exitPath: {
          path_id: 'desc',
        },
      },
    });

    // Extract just the exit paths
    const exitPaths = paths.map(link => link.exitPath);

    res.json({ success: true, paths: exitPaths });
  } catch (err) {
    console.error("getPathsForQr:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};