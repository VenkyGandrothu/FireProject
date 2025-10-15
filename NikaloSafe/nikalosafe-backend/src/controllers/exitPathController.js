import prisma from '../config/prisma.js';

// Controller → Register exit paths (single or multiple)
export const registerExitPaths = async (req, res) => {
  try {
    const paths = req.body;

    // Check if it's a single path or an array
    if (Array.isArray(paths)) {
      // Multiple paths
      if (paths.length === 0) {
        return res.status(400).json({ success: false, message: "Paths array is required" });
      }

      const createdPaths = await prisma.exitPath.createMany({
        data: paths.map(path => ({
          floor_id: Number(path.floor_id),
          start_point: path.start_point,
          end_point: path.end_point,
          path_status: path.path_status,
          path_length: parseFloat(path.path_length),
        })),
      });

      res.status(201).json({ success: true, count: createdPaths.count });
    } else {
      // Single path
      const { floor_id, start_point, end_point, path_status, path_length } = paths;

      const exitPath = await prisma.exitPath.create({
        data: {
          floor_id: Number(floor_id),
          start_point,
          end_point,
          path_status,
          path_length: parseFloat(path_length),
        },
      });

      res.status(201).json({ success: true, exitPath });
    }
  } catch (err) {
    console.error("registerExitPaths:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get all exit paths
export const getAllExitPaths = async (req, res) => {
  try {
    const exitPaths = await prisma.exitPath.findMany({
      orderBy: {
        path_id: 'desc',
      },
    });

    res.json({ success: true, exitPaths });
  } catch (err) {
    console.error("getAllExitPaths:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get exit path by ID
export const getExitPathById = async (req, res) => {
  try {
    const { id } = req.params;

    const exitPath = await prisma.exitPath.findUnique({
      where: {
        path_id: Number(id),
      },
    });

    if (!exitPath) {
      return res.status(404).json({ success: false, message: "Exit path not found" });
    }

    res.json({ success: true, exitPath });
  } catch (err) {
    console.error("getExitPathById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Delete exit path by ID
export const deleteExitPath = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExitPath = await prisma.exitPath.delete({
      where: {
        path_id: Number(id),
      },
    });

    res.json({ success: true, message: "Exit path deleted successfully", exitPath: deletedExitPath });
  } catch (err) {
    console.error("deleteExitPath:", err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Exit path not found" });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get exit paths by floor
export const getExitPathsByFloor = async (req, res) => {
  try {
    const { floor_id } = req.params;

    const exitPaths = await prisma.exitPath.findMany({
      where: {
        floor_id: Number(floor_id),
      },
      orderBy: {
        path_id: 'desc',
      },
    });

    res.json({ success: true, exitPaths });
  } catch (err) {
    console.error("getExitPathsByFloor:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};