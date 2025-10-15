import prisma from '../config/prisma.js';

// Controller → Register a new floor (alias for createFloor)
export const registerFloor = async (req, res) => {
  try {
    const { building_id, floor_number, description, num_sensors } = req.body;

    // Create floor using Prisma
    const floor = await prisma.floor.create({
      data: {
        building_id: Number(building_id),
        floor_number: Number(floor_number),
        description: description || null,
        num_sensors: num_sensors || 0,
      },
    });

    res.status(201).json({ success: true, floor });
  } catch (err) {
    console.error("registerFloor:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get all floors
export const getAllFloors = async (req, res) => {
  try {
    const floors = await prisma.floor.findMany({
      orderBy: {
        floor_id: 'desc',
      },
    });

    res.json({ success: true, floors });
  } catch (err) {
    console.error("getAllFloors:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get floors by building
export const getFloorsByBuilding = async (req, res) => {
  try {
    const { building_id } = req.params;

    const floors = await prisma.floor.findMany({
      where: {
        building_id: Number(building_id),
      },
      orderBy: {
        floor_number: 'asc',
      },
    });

    res.json({ success: true, floors });
  } catch (err) {
    console.error("getFloorsByBuilding:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get floor by ID
export const getFloorById = async (req, res) => {
  try {
    const { id } = req.params;

    const floor = await prisma.floor.findUnique({
      where: {
        floor_id: Number(id),
      },
    });

    if (!floor) {
      return res.status(404).json({ success: false, message: "Floor not found" });
    }

    res.json({ success: true, floor });
  } catch (err) {
    console.error("getFloorById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Delete floor by ID
export const deleteFloor = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFloor = await prisma.floor.delete({
      where: {
        floor_id: Number(id),
      },
    });

    res.json({ success: true, message: "Floor deleted successfully", floor: deletedFloor });
  } catch (err) {
    console.error("deleteFloor:", err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Floor not found" });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};