import prisma from '../config/prisma.js';

// Controller → Register customer-building relationship (alias for createCustomerBuilding)
export const registerCustomerBuilding = async (req, res) => {
  try {
    const { customer_id, building_id, days_of_subscription, start_date, end_date, subscription_status } = req.body;

    // Create customer-building relationship using Prisma
    const customerBuilding = await prisma.customerBuilding.create({
      data: {
        customer_id: Number(customer_id),
        building_id: Number(building_id),
        days_of_subscription: Number(days_of_subscription),
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        subscription_status: subscription_status || "inactive",
      },
    });

    res.status(201).json({ success: true, customerBuilding });
  } catch (err) {
    console.error("registerCustomerBuilding:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get all customer-building relationships
export const getAllCustomerBuildings = async (req, res) => {
  try {
    const customerBuildings = await prisma.customerBuilding.findMany({
      include: {
        customer: true,
        building: true,
      },
      orderBy: {
        customer_building_id: 'desc',
      },
    });

    res.json({ success: true, customerBuildings });
  } catch (err) {
    console.error("getAllCustomerBuildings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get customer-building relationship by ID
export const getCustomerBuildingById = async (req, res) => {
  try {
    const { id } = req.params;

    const customerBuilding = await prisma.customerBuilding.findUnique({
      where: {
        customer_building_id: Number(id),
      },
      include: {
        customer: true,
        building: true,
      },
    });

    if (!customerBuilding) {
      return res.status(404).json({ success: false, message: "Customer-building relationship not found" });
    }

    res.json({ success: true, customerBuilding });
  } catch (err) {
    console.error("getCustomerBuildingById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Delete customer-building relationship by ID
export const deleteCustomerBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCustomerBuilding = await prisma.customerBuilding.delete({
      where: {
        customer_building_id: Number(id),
      },
    });

    res.json({ success: true, message: "Customer-building relationship deleted successfully", customerBuilding: deletedCustomerBuilding });
  } catch (err) {
    console.error("deleteCustomerBuilding:", err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Customer-building relationship not found" });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};