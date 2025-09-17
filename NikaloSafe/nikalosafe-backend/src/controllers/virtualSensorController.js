import { VirtualSensor } from "../models/virtualSensorModel.js";

// Register a single virtual sensor
export const registerVirtualSensor = async (req, res) => {
  try {
    const { sensor_id, floor_id, virtual_sensor_number, animation_status } = req.body;

    if (!sensor_id || !floor_id || !virtual_sensor_number) {
      return res.status(400).json({ message: "sensor_id, floor_id, and virtual_sensor_number are required" });
    }

    const sensor = await VirtualSensor.create({
      sensor_id,
      floor_id,
      virtual_sensor_number,
      animation_status: animation_status || "Normal",
    });

    res.status(201).json({
      message: "Virtual sensor registered successfully",
      sensor,
    });
  } catch (err) {
    console.error("Error in registerVirtualSensor:", err.message);
    res.status(500).json({ message: "Failed to register virtual sensor" });
  }
};

// Bulk register virtual sensors
export const registerVirtualSensorsBulk = async (req, res) => {
  try {
    const sensors = req.body;

    if (!Array.isArray(sensors) || sensors.length === 0) {
      return res.status(400).json({ message: "Invalid input: array of sensors required" });
    }

    // Validate each sensor
    for (const s of sensors) {
      if (!s.sensor_id || !s.floor_id || !s.virtual_sensor_number) {
        return res.status(400).json({ message: "Each sensor must have sensor_id, floor_id, and virtual_sensor_number" });
      }
    }

    const inserted = await VirtualSensor.createBulk(sensors);

    res.status(201).json({
      message: "Virtual sensors registered successfully",
      sensors: inserted,
    });
  } catch (err) {
    console.error("Error in registerVirtualSensorsBulk:", err.message);
    res.status(500).json({ message: "Failed to register virtual sensors" });
  }
};

// Get all virtual sensors
export const getAllVirtualSensors = async (req, res) => {
  try {
    const sensors = await VirtualSensor.findAll();
    res.json(sensors);
  } catch (err) {
    console.error("Error fetching virtual sensors:", err.message);
    res.status(500).json({ message: "Failed to fetch virtual sensors" });
  }
};

// Get virtual sensor by ID
export const getVirtualSensorById = async (req, res) => {
  try {
    const { id } = req.params;
    const sensor = await VirtualSensor.findById(id);
    if (!sensor) {
      return res.status(404).json({ message: "Virtual sensor not found" });
    }
    res.json(sensor);
  } catch (err) {
    console.error("Error fetching virtual sensor:", err.message);
    res.status(500).json({ message: "Failed to fetch virtual sensor" });
  }
};

// Delete virtual sensor
export const deleteVirtualSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await VirtualSensor.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Virtual sensor not found" });
    }
    res.json({ message: "Virtual sensor deleted successfully", sensor: deleted });
  } catch (err) {
    console.error("Error deleting virtual sensor:", err.message);
    res.status(500).json({ message: "Failed to delete virtual sensor" });
  }
};

// Get virtual sensors by floor
export const getVirtualSensorsByFloor = async (req, res) => {
  try {
    const { floorId } = req.params;
    if (!floorId) {
      return res.status(400).json({ message: "floorId is required" });
    }

    const sensors = await VirtualSensor.findByFloor(floorId);
    res.json(sensors);
  } catch (err) {
    console.error("Error fetching virtual sensors by floor:", err.message);
    res.status(500).json({ message: "Failed to fetch virtual sensors by floor" });
  }
};
