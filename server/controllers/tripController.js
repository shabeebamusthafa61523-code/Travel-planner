const Trip = require("../models/Trip");

// Create trip
exports.createTrip = async (req, res) => {
  const { title, destination, startDate, endDate, activities } = req.body;
  try {
    const trip = await Trip.create({
      user: req.user.id,
      title,
      destination,
      startDate,
      endDate,
      activities,
    });
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all trips for user
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get trip by ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update trip
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

if (req.body.title !== undefined && req.body.title !== "") {
  trip.title = req.body.title;
}
    trip.destination = req.body.destination;
    trip.startDate = req.body.startDate || null;
    trip.endDate = req.body.endDate || null;
    trip.activities = Array.isArray(req.body.activities)
      ? req.body.activities
      : [];

    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error("UPDATE ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Optional: check if the user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Use deleteOne instead of remove
    await trip.deleteOne();
     res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Delete trip error:", err);
    res.status(500).json({ message: "Server error while deleting trip" });
  }
};


