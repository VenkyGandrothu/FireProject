import prisma from '../config/prisma.js';

// Controller → Register a new building
export const registerBuilding = async (req, res) => {
  try {
    const { building_name, num_floors, building_address, building_city, building_state, building_country } = req.body;

    // Create building using Prisma
    const building = await prisma.building.create({
      data: {
        building_name,
        num_floors: num_floors ? Number(num_floors) : null,
        building_address: building_address || null,
        building_city: building_city || null,
        building_state: building_state || null,
        building_country: building_country || null,
      },
    });

    // Send a success response with the newly created building
    res.status(201).json({ success: true, building });
  } catch (err) {
    // Log the error to console for debugging
    console.error("registerBuilding:", err);

    // Send a generic server error response to the client
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Fetch all buildings
export const getAllBuildings = async (req, res) => {
  try {
    // Fetch all buildings using Prisma
    const buildings = await prisma.building.findMany({
      orderBy: {
        building_id: 'desc',
      },
    });

    // Send success response with the list of buildings
    res.json({ success: true, buildings });
  } catch (err) {
    // Log the error to console
    console.error("getAllBuildings:", err);

    // Send a generic server error response
    res.status(500).json({ success: false });
  }
};