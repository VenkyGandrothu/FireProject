import prisma from '../config/prisma.js';

// Controller → Register physical sensor (alias for createPhysicalSensor)
export const registerSensor = async (req, res) => {
  try {
    const { floor_id, sensor_number, location, type, sensor_status } = req.body;

    const sensor = await prisma.physicalSensor.create({
      data: {
        floor_id: Number(floor_id),
        sensor_number: String(sensor_number),
        location: location || null,
        type,
        sensor_status,
      },
    });

    res.status(201).json({ success: true, sensor });
  } catch (err) {
    console.error("registerSensor:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Register multiple sensors in bulk
export const registerSensorsBulk = async (req, res) => {
  try {
    const { floor_id, sensors } = req.body;

    if (!sensors || sensors.length === 0) {
      return res.status(400).json({ success: false, message: "Sensors array is required" });
    }

    const createdSensors = [];
    for (const sensor of sensors) {
      const createdSensor = await prisma.physicalSensor.create({
        data: {
          floor_id: Number(floor_id),
          sensor_number: String(sensor.sensor_number),
          location: sensor.location || null,
          type: sensor.type,
          sensor_status: sensor.sensorStatus,
        },
      });
      createdSensors.push(createdSensor);
    }

    res.status(201).json({ success: true, sensors: createdSensors });
  } catch (err) {
    console.error("registerSensorsBulk:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get all physical sensors
export const getAllSensors = async (req, res) => {
  try {
    const sensors = await prisma.physicalSensor.findMany({
      orderBy: {
        sensor_id: 'asc',
      },
    });

    res.json({ success: true, sensors });
  } catch (err) {
    console.error("getAllSensors:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get sensor by ID
export const getSensorById = async (req, res) => {
  try {
    const { id } = req.params;

    const sensor = await prisma.physicalSensor.findUnique({
      where: {
        sensor_id: Number(id),
      },
    });

    if (!sensor) {
      return res.status(404).json({ success: false, message: "Sensor not found" });
    }

    res.json({ success: true, sensor });
  } catch (err) {
    console.error("getSensorById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get sensors by floor
export const getSensorsByFloor = async (req, res) => {
  try {
    const { floorId } = req.params;

    const sensors = await prisma.physicalSensor.findMany({
      where: {
        floor_id: Number(floorId),
      },
      orderBy: {
        sensor_id: 'asc',
      },
    });

    res.json({ success: true, sensors });
  } catch (err) {
    console.error("getSensorsByFloor:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Delete sensor by ID
export const deleteSensor = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSensor = await prisma.physicalSensor.delete({
      where: {
        sensor_id: Number(id),
      },
    });

    res.json({ success: true, message: "Sensor deleted successfully", sensor: deletedSensor });
  } catch (err) {
    console.error("deleteSensor:", err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Sensor not found" });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};