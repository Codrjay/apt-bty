// routes/analytics.js
const express = require('express');
const router = express.Router();

const analyticsData = {
  totalSales: 125,
  trendingNFTs: [
    { id: 1, name: "Cool NFT", sales: 40 },
    { id: 2, name: "Rare NFT", sales: 30 },
  ],
  popularCategories: ["Art", "Gaming", "Photography"],
};

router.get('/', (req, res) => {
  res.json(analyticsData);
});

module.exports = router;
