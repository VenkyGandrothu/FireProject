// controllers/physicalSensorController.js
import { PhysicalSensor } from "../models/physicalSensorModel.js";

// Register a single sensor
export const registerSensor = async (req, res) => {
  try {
    const { floorId, sensor_number, location, type, sensorStatus } = req.body;

    if (!floorId || !sensor_number || !type || !sensorStatus) {
      return res.status(400).json({ message: "floorId, sensor_number, type, and sensorStatus are required" });
    }

    const sensor = await PhysicalSensor.create({
      floor_id: floorId,
      sensor_number,
      location: location || null,
      type,
      sensor_status: sensorStatus,
    });

    res.status(201).json({
      message: "Sensor registered successfully",
      sensor,
    });
  } catch (err) {
    console.error("Error in registerSensor:", err.message);
    res.status(500).json({ message: "Failed to register sensor" });
  }
};

// Bulk register sensors
export const registerSensorsBulk = async (req, res) => {
  try {
    const { floorId, sensors } = req.body;

    if (!floorId || !Array.isArray(sensors) || sensors.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Validate each sensor in the array
    for (const s of sensors) {
      if (!s.sensor_number || !s.type || !s.sensorStatus) {
        return res.status(400).json({ message: "Each sensor must have sensor_number, type, and sensorStatus" });
      }
    }

    const insertedSensors = await PhysicalSensor.createBulk(floorId, sensors);

    res.status(201).json({
      message: "Sensors registered successfully",
      sensors: insertedSensors,
    });
  } catch (err) {
    console.error("Error in registerSensorsBulk:", err.message);
    res.status(500).json({ message: "Failed to register sensors" });
  }
};

// Get all sensors
export const getAllSensors = async (req, res) => {
  try {
    const sensors = await PhysicalSensor.findAll();
    res.json(sensors);
  } catch (err) {
    console.error("Error fetching sensors:", err.message);
    res.status(500).json({ message: "Failed to fetch sensors" });
  }
};

// Get sensor by ID
export const getSensorById = async (req, res) => {
  try {
    const { id } = req.params;
    const sensor = await PhysicalSensor.findById(id);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }
    res.json(sensor);
  } catch (err) {
    console.error("Error fetching sensor:", err.message);
    res.status(500).json({ message: "Failed to fetch sensor" });
  }
};

// Delete sensor
export const deleteSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PhysicalSensor.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Sensor not found" });
    }
    res.json({ message: "Sensor deleted successfully", sensor: deleted });
  } catch (err) {
    console.error("Error deleting sensor:", err.message);
    res.status(500).json({ message: "Failed to delete sensor" });
  }
};
