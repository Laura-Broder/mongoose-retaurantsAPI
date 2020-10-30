const express = require("express");
const Restaurant = require("../models/restaurant.js");
const router = new express.Router();

router.post("/restaurants", (req, res) => {
  const rest = new Restaurant(req.body);
  rest
    .save()
    .then(() => {
      res.status(201).send(rest);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

router.get("/restaurants/:id", (req, res) => {
  const restId = req.params.id;
  Restaurant.findById(restId)
    .then((rest) => {
      if (!rest) {
        return res.status(404).send("no restaurant was found");
      }
      res.send(rest);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Ex 4:
// Will fetch all by given string and will return the count of cuisines
// /restaurant/countByCuisine/:cuisine
// 1. promise
router.get("/restaurants/countByCuisine/:cuisine", (req, res) => {
  const cuisine = req.params.cuisine;
  Restaurant.find({ cuisine: cuisine })
    .then(() => {
      return Restaurant.countDocuments({ cuisine: cuisine }).then((num) => {
        if (!num) {
          return res
            .status(404)
            .send(`No restaurants found with "${cuisine}" cuisine.`);
        }
        res.send(`There are ${num} restaurants with ${cuisine} cuisine.`);
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// 2. async/await
router.get("/restaurants/countByBorough/:borough", async (req, res) => {
  const borough = req.params.borough;
  try {
    const count = await Restaurant.countDocuments({ borough: borough });

    if (!count) {
      return res
        .status(404)
        .send(`No restaurants found with "${borough}" borough.`);
    }
    res.send(`There are ${count} restaurants with ${borough} borough.`);
  } catch (error) {
    return res.status(500).send(error);
  }
});
// Ex 5:
// Create post or patch operation
// Update restaurant by id, and update specific fields (e.g. cuisine, borough, name)
router.patch("/restaurants/update/:id", async (req, res) => {
  const newDataKeys = Object.keys(req.body);
  const allowedUpdate = ["borough", "cuisine", "name"];
  const isValidUpdate = newDataKeys.every((key) => {
    return allowedUpdate.includes(key);
  });

  if (!isValidUpdate) {
    return res.status(400).send(`Invalid update`);
  }
  const id = req.params.id;
  const newData = req.body;
  try {
    const newRest = await Restaurant.findByIdAndUpdate({ _id: id }, newData, {
      new: true,
      runValidators: true,
    });

    if (!newRest) {
      return res.status(404).send(`No restaurants found with ID "${id}".`);
    }
    return res.send(newRest);
  } catch (error) {
    // can be validation error or server error
    return res.status(500).send(error);
  }
});

// Create a delete endpoint to delete (restaurant) by id
router.delete("/restaurants/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedRest = await Restaurant.findOneAndDelete({ _id: id });
    if (!deletedRest) {
      return res.status(404).send(`Restaurant with ID ${id} was not found.`);
    }
    res.send(`There restaurant with ID ${id} was deleted.`);
  } catch (err) {
    return res.status(500).send(error);
  }
});

module.exports = router;
