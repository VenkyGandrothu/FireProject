import prisma from '../config/prisma.js';

// Controller → Register virtual sensor (alias for createVirtualSensor)
export const registerVirtualSensor = async (req, res) => {
  try {
    const { sensor_id, floor_id, virtual_sensor_number, animation_status } = req.body;

    if (!sensor_id || !floor_id || !virtual_sensor_number) {
      return res.status(400).json({ success: false, message: "sensor_id, floor_id, and virtual_sensor_number are required" });
    }

    const virtualSensor = await prisma.virtualSensor.create({
      data: {
        sensor_id: Number(sensor_id),
        floor_id: Number(floor_id),
        virtual_sensor_number: String(virtual_sensor_number),
        animation_status: animation_status || "Normal",
      },
    });

    res.status(201).json({ success: true, virtualSensor });
  } catch (err) {
    console.error("registerVirtualSensor:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Register multiple virtual sensors in bulk
export const registerVirtualSensorsBulk = async (req, res) => {
  try {
    const { sensors } = req.body;

    if (!sensors || sensors.length === 0) {
      return res.status(400).json({ success: false, message: "Sensors array is required" });
    }

    const createdSensors = [];
    for (const sensor of sensors) {
      const createdSensor = await prisma.virtualSensor.create({
        data: {
          sensor_id: Number(sensor.sensor_id),
          floor_id: Number(sensor.floor_id),
          virtual_sensor_number: String(sensor.virtual_sensor_number),
          animation_status: sensor.animation_status || "Normal",
        },
      });
      createdSensors.push(createdSensor);
    }

    res.status(201).json({ success: true, sensors: createdSensors });
  } catch (err) {
    console.error("registerVirtualSensorsBulk:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get all virtual sensors
export const getAllVirtualSensors = async (req, res) => {
  try {
    const virtualSensors = await prisma.virtualSensor.findMany({
      orderBy: {
        virtual_sensor_id: 'asc',
      },
    });

    res.json({ success: true, virtualSensors });
  } catch (err) {
    console.error("getAllVirtualSensors:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get virtual sensor by ID
export const getVirtualSensorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "virtual_sensor_id is required" });
    }

    const virtualSensor = await prisma.virtualSensor.findUnique({
      where: {
        virtual_sensor_id: Number(id),
      },
    });

    if (!virtualSensor) {
      return res.status(404).json({ success: false, message: "Virtual sensor not found" });
    }

    res.json({ success: true, virtualSensor });
  } catch (err) {
    console.error("getVirtualSensorById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get virtual sensors by floor
export const getVirtualSensorsByFloor = async (req, res) => {
  try {
    const { floorId } = req.params;

    if (!floorId) {
      return res.status(400).json({ success: false, message: "floor_id is required" });
    }

    const virtualSensors = await prisma.virtualSensor.findMany({
      where: {
        floor_id: Number(floorId),
      },
      orderBy: {
        virtual_sensor_id: 'asc',
      },
    });

    res.json({ success: true, virtualSensors });
  } catch (err) {
    console.error("getVirtualSensorsByFloor:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Delete virtual sensor by ID
export const deleteVirtualSensor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "virtual_sensor_id is required" });
    }

    const deletedVirtualSensor = await prisma.virtualSensor.delete({
      where: {
        virtual_sensor_id: Number(id),
      },
    });

    res.json({ success: true, message: "Virtual sensor deleted successfully", virtualSensor: deletedVirtualSensor });
  } catch (err) {
    console.error("deleteVirtualSensor:", err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Virtual sensor not found" });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};